class Api::ShareOptionsController < Api::ApplicationController
  before_action :set_resource

  def update
    @share_options.update!(share_options_params)
    render json: :no_content
  end

  def auth_password
    render json: @share_options.link_password_match?(params["link_password"])
  end

  private

  def share_options_params
    # it's not a mistake, it's fuss about strong params, wrapping, and inflector
    # should be share_options
    params.require(:share_option).permit(:link_access, :link_password)
  end

  def set_resource
    # @type [Store::Resource]
    @resource = Store::Resource
      .includes(:share_options)
      .find(params[:id])

    # @type [Store::ShareOptions]
    @share_options = @resource.share_options
  end
end
