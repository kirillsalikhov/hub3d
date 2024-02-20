class Api::ShareOptionsController < Api::ApplicationController
  before_action :set_resource

  def update
    # NOTE: if password change, old accessor_password_link are not revoked
    share_options.update!(share_options_params)
    head :ok
  end

  def auth_password
    if share_options.link_password_match?(params["link_password"])
      # TODO move to interactor or share options
      user = current_or_guest_user
      user.add_role(:accessor_password_link, @resource)
      head :ok
    else
      head :forbidden
    end
  end

  private

  def share_options_params
    # it's not a mistake, it's fuss about strong params, wrapping, and inflector
    # should be share_options TODO see inflector
    params.require(:share_option).permit(:link_access, :link_password)
  end

  # @return [Store::ShareOptions]
  def share_options = @resource.share_options

  def set_resource
    # @type [Store::Resource]
    @resource = Store::Resource
      .includes(:share_options)
      .find(params[:id])
  end
end
