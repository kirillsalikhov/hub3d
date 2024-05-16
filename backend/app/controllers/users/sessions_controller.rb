# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  after_action :after_login_or_signup, only: :create

  skip_forgery_protection only: :create
  wrap_parameters :user
  respond_to :json

  # before_action :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  def new
    self.resource = resource_class.new(sign_in_params)
    clean_up_passwords(resource)
    render_page
  end

  # POST /resource/sign_in
  def create
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)
    # TODO use blueprinter
    render json: {user: resource, redirect_url: after_sign_in_path_for(resource)}
  end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end

  # Simulate guest user creation
  # used for testing only
  #
  def simulate_guest_user
    u = guest_user
    render json: u.id
  end
end
