class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    user = User::AuthFromOmniauth.run!(auth: from_google_params)

    if user.present?
      sign_out_all_scopes
      # TODO !!! check if TransferGuest works
      sign_in_and_redirect user, event: :authentication
    else
      # TODO This is not checked
      redirect_to new_user_session_path
    end
  end

  def failure
    # TODO This is not checked, and copy pasted
    set_flash_message! :alert, :failure, kind: OmniAuth::Utils.camelize(failed_strategy.name), reason: failure_message
    redirect_to after_omniauth_failure_path_for(resource_name)
  end

  private

  def from_google_params
    @from_google_params ||= {
      uid: auth.uid,
      email: auth.info.email,
      provider: "google"
    }
  end

  def auth
    @auth ||= request.env["omniauth.auth"]
  end
end
