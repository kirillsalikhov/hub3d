class ResourceController < ApplicationController
  before_action :set_resource
  before_action :redirect_if_password_link_and_no_access, only: :show
  def show
    authorize(@resource)
    # TODO  Should be current, not first
    version = @resource.versions.with_attached_files.first

    # TODO should be in helper or whatever
    # should be refresh field, maybe checksum
    # originFilePath can be empty for source files
    files = version.files.map do |f|
      {
        signedUrl: f.url(expires_in: 1.hour),
        originFilePath: f.blob.metadata[:origin_file_path],
        filename: f.filename,
        size: f.byte_size
      }
    end

    render inertia: "Resource", props: {
      resource: @resource,
      version: version,
      files: files
    }
  end

  def auth_password
    # TODO probably return forbiden
    unless @resource.share_options.link_with_password?
      render html: "No password, also do smth about it"
      return
    end

    render inertia: "ResourcePassword", props: {
      resourceId: @resource.id
    }
  end

  def edit_share_options
    # TODO add current share_options
    render inertia: "EditShareOptions", props: {
      resourceId: @resource.id
    }
  end

  private

  def redirect_if_password_link_and_no_access
    if @resource.share_options.link_with_password?
      policy = Pundit.policy!(pundit_user, @resource)
      unless policy.show?
        redirect_to action: "auth_password", id: @resource.id and return
      end
    end
  end

  def set_resource
    # @type [Store::Resource]
    @resource = Store::Resource
      .includes(:share_options)
      .find(params[:id])
  end
end
