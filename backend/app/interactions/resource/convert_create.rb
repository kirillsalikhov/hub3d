class Resource::ConvertCreate < ActiveInteraction::Base
  object :input, class: "ActiveStorage::Blob"
  record :user

  def execute
    create_conversion
    create_resource
    prepare_task
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
    # TODO difference with Conversion::ConvertAnonOp
    @resource.share_options.link_access = :none
    # TODO should be current, or smth like
    @version = @resource.versions.new
    @resource.current = @version
    @resource.save!
  end

  def prepare_task
    @conversion_task.on_success = Store::SuccessVersionConvert.new(
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
