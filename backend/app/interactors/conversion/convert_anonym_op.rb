# TODO defenenetly move to other module
# probably rename
class Conversion::ConvertAnonymOp
  include Interactor

  def call
    create_conversion
    # create user
    # create space
    create_resource
    prepare_task
    schedule_task
  end

  private

  def create_conversion
    result = Conversion::CreateConversion.call(
      input: context.input,
      # TODO detect recepie from file extension
      recipe: "cad2wmd",
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
    @resource = Store::Resource.new(name: resource_name)
    # TODO should be current, or smth like
    @version = @resource.versions.new
    @resource.save
  end

  def prepare_task
    @conversion_task.on_success = Store::SuccessVersionConvertOrg.new(
      version_id: @version.id
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
end
