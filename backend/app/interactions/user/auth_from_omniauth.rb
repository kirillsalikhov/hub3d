class User::AuthFromOmniauth < ActiveInteraction::Base
  hash :auth do
    string :email
    string :uid
    string :provider
  end

  def execute
    user = existing_user || new_user

    ensure_provider_data(user)

    user.save!

    user
  end

  private

  def existing_user = User.find_by(email: email)

  def new_user
    User.new(
      email: email,
      password: Devise.friendly_token[0, 20]
    )
  end

  def ensure_provider_data(user)
    # do nothing if provider already set
    return if user.provider.present?

    user.uid = auth[:uid]
    user.provider = auth[:provider]
  end

  def email = auth[:email]
end
