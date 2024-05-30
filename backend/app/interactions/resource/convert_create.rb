class Resource::ConvertCreate < ActiveInteraction::Base
  object :input, class: "ActiveStorage::Blob"
  symbol :link_access, default: :none
  record :user

  def execute
    create_conversion
    # TODO add catch with rethrow on transaction rollback
    # cancel @conversion_task, probably cancel conversion on ConversionService
    # do not span transaction to create_conversion as it's long rpc
    # also do that in convert_update and similar places with sort of a helper/module/concern
    ActiveRecord::Base.transaction do
      create_resource
      prepare_task
    end
    schedule_task

    [@conversion_task, @resource]
  end

  def create_conversion
    @conversion_task = Conversion::CreateConversion.run!(
      input: input,
      recipe: get_recipe
    )
  end

  def create_resource
    @resource = Store::Resource.new(name: resource_name, author: user)
    @resource.share_options.link_access = link_access

    create_version

    @resource.current = @version
    @resource.save!
  end

  def create_version
    @version = Version::CreateWithSource.run!(
      resource: @resource,
      status: :pending,
      source_files: [input]
    )
  end

  def prepare_task
    @conversion_task.on_success = Version::SuccessConvert.new(
      version_id: @version.id,
      cs_server_url: @conversion_task.cs_server_url
    )

    @conversion_task.meta[:dest_resource_id] = @resource.id
    @conversion_task.meta[:dest_version_id] = @version.id
    @conversion_task.save!
  end

  def schedule_task
    Store::ConversionJob.perform_async(@conversion_task.id)
  end

  private

  def resource_name = input.filename

  def get_recipe
    filename, byte_size = input.values_at(:filename, :byte_size)
    Conversion::Recipe.from_input(filename.to_s, byte_size)
  end
end
