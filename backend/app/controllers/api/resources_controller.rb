class Api::ResourcesController < Api::ApplicationController
  before_action :set_resource, only: [:show, :destroy, :convert_update, :set_current]

  def index
    # TODO check should be scoped?
    authorize(dummy_auth_resource)
    resources = Store::Resource.order(created_at: :desc)
    render json: Store::ResourceBlueprint.render(resources)
  end

  def show
    authorize(@resource)
    render json: Store::ResourceBlueprint.render(@resource, view: :normal, user: pundit_user)
  end

  def destroy
    authorize(@resource)
    Resource::Destroy.run!(resource: @resource)
    head :no_content
  end

  def set_current
    authorize(@resource)
    resource = Resource::SetCurrent.run!(resource: @resource, version: params[:current_id])
    # TODO :normal is more then needed
    render json: Store::ResourceBlueprint.render(resource, view: :normal, user: pundit_user)
  end

  def convert_create
    authorize(dummy_auth_resource)
    blob = ActiveStorage::Blob.find_signed(params[:input_file])
    task, resource = Resource::ConvertCreate.run!(input: blob, user: current_user)

    render json: {
      resource: Store::ResourceBlueprint.render_as_hash(resource),
      task: Store::ConversionTaskBlueprint.render_as_hash(task)
    }
  end

  def convert_update
    authorize(@resource)
    blob = ActiveStorage::Blob.find_signed(params[:input_file])
    task, version = Resource::ConvertUpdate.run!(input: blob, resource: @resource)

    render json: {
      version: Store::VersionBlueprint.render_as_hash(version),
      task: Store::ConversionTaskBlueprint.render_as_hash(task)
    }
  end

  private

  def set_resource
    # @type [Store::Resource]
    @resource = Store::Resource
      .includes(:share_options, :current)
      .find(params[:id])
  end

  # Used for auth for actions like create, index when entity yet doesn't exists
  # other way is auth against parent entity, this way auth logic will bleed to controllers
  def dummy_auth_resource
    Store::Resource.new(space: ActsAsTenant.current_tenant)
  end

end
