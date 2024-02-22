# TODO defenenetly move to other module
# probably rename to ConvertGuestOp
class Conversion::ConvertAnonymOp
  include Interactor

  def call
    create_conversion
    # create space
    create_resource
    prepare_task
    schedule_task
  end

  private

  def create_conversion
    result = Conversion::CreateConversion.call(
      input: context.input,
      recipe: get_recipe,
      on_success: nil # !!! TODO think about, because ConversionTask is saved
    )
    if result.success?
      @conversion_task = result.conversion_task
      context.conversion_task = @conversion_task
    else
      # TODO fail context => return cs error
      put "!!! ERROR See TODO !!!"
    end
  end

  def create_resource
    # TODO set resource, versions types
    @resource = Store::Resource.new(name: resource_name, author: context.user)
    @resource.share_options.link_access = :view
    # TODO should be current, or smth like
    @version = @resource.versions.new
    @resource.save
  end

  def prepare_task
    # TODO probably pass job id, instead of passing it in finish
    @conversion_task.on_success = Store::SuccessVersionConvertOrg.new(
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

  def resource_name
    context.input.filename
  end

  private

  def get_recipe
    filename, byte_size = context.input.values_at(:filename, :byte_size)
    Conversion::Recipe.from_input(filename.to_s, byte_size)
  end
end
