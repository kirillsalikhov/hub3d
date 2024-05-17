class Api::ResourcesController < Api::ApplicationController
  before_action :set_resource, only: [:show]

  def index
    # TODO authorize
    resources = Store::Resource.all
    render json: Store::ResourceBlueprint.render(resources)
  end

  def show
    authorize(@resource)
    render json: Store::ResourceBlueprint.render(@resource, view: :normal, user: pundit_user)
  end

  private

  def set_resource
    # @type [Store::Resource]
    @resource = Store::Resource
      .includes(:share_options)
      .find(params[:id])
  end
end
