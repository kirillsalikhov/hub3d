class Api::ResourcesController < Api::ApplicationController
  before_action :set_resource, only: [:show, :destroy, :convert_update, :set_current]

  def index
    # TODO authorize
    resources = Store::Resource.order(created_at: :desc)
    render json: Store::ResourceBlueprint.render(resources)
  end

  def show
    authorize(@resource)
    render json: Store::ResourceBlueprint.render(@resource, view: :normal, user: pundit_user)
  end

  def destroy
    # TODO authorize
    Resource::Destroy.run!(resource: @resource)
    head :no_content
  end

  def set_current
    # TODO authorize
    resource = Resource::SetCurrent.run!(resource: @resource, version: params[:current_id])
    render json: Store::ResourceBlueprint.render(resource, view: :normal, user: pundit_user)
  end

  def convert_create
    # TODO authorize
    blob = ActiveStorage::Blob.find_signed(params[:input_file])
    task, resource = Resource::ConvertCreate.run!(input: blob, user: current_user)
    # TODO catch conversion error, or move it appliaction controller
    render json: {
      resource: Store::ResourceBlueprint.render_as_hash(resource),
      task: Store::ConversionTaskBlueprint.render_as_hash(task)
    }
  end

  def convert_update
    # TODO authorize
    blob = ActiveStorage::Blob.find_signed(params[:input_file])
    task, version = Resource::ConvertUpdate.run!(input: blob, resource: @resource)
    # TODO catch conversion error, or move it appliaction controller
    render json: {
      version: Store::VersionBlueprint.render_as_hash(version),
      task: Store::ConversionTaskBlueprint.render_as_hash(task)
    }
  end

  private

  def set_resource
    # TODO move to scope ?
    # @type [Store::Resource]
    @resource = Store::Resource
      .includes(:share_options, :current)
      .find(params[:id])
  end
end
