class ResourceController < ApplicationController
  before_action :set_resource
  before_action :redirect_if_password_link_and_no_access, only: :show
  def show
    authorize(@resource)
    render_page
  end

  def auth_password
    unless @resource.share_options.link_with_password?
      redirect_to action: "show", id: @resource.id and return
    end

    # if user already has access to resource(show)
    if Pundit.policy!(pundit_user, @resource).show?
      redirect_to action: "show", id: @resource.id and return
    end

    render inertia: "ResourcePassword", props: {
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
