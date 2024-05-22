class Resource::ConvertUpdate < ActiveInteraction::Base
  object :input, class: "ActiveStorage::Blob"
  record :resource, class: "Store::Resource"

  def execute
    create_conversion
    create_version
    prepare_task
    schedule_task

    [@conversion_task, @version]
  end

  def create_conversion
    @conversion_task = Conversion::CreateConversion.run!(
      input: input,
      recipe: get_recipe
    )
  end

  def create_version
    # todo add author to version, and in other places too
    @version = resource.versions.new
    @version.save!
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

  def get_recipe
    filename, byte_size = input.values_at(:filename, :byte_size)
    Conversion::Recipe.from_input(filename.to_s, byte_size)
  end

end
