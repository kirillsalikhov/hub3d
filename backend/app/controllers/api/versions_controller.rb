class Api::VersionsController < Api::ApplicationController
  before_action :set_version, only: [:show]

  def index
    # TODO authorize
    @resource = Store::Resource.find(params[:id])
    render json: Store::VersionBlueprint.render(@resource.asset_items)
  end

  def versions
    # TODO authorize
    @resource = Store::Resource.find(params[:id])
    render json: Store::VersionBlueprint.render(@resource.versions)
  end

  def show
    # TODO authorize HUB-3-D-T-92
    render json: Store::VersionBlueprint.render(@version)
  end

  def files
    # TODO authorize HUB-3-D-T-92
    version = Store::Version
      .with_attached_files
      .find(params[:id])

    render json: Store::FileBlueprint.render_as_json(version.files.attachments)
  end

  private

  def set_version
    # @type [Store::Version]
    @version = Store::Version.find(params[:id])
  end
end
