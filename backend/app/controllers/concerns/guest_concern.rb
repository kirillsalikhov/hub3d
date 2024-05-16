module GuestConcern
  extend ActiveSupport::Concern

  # Safe function to check if user is guest
  # doesn't create guest user if not exists
  #
  # @return [Boolean]
  def is_guest?
    session[:guest_user_id].present?
  end

  # TODO rewrite stuff from device_guests here
  def after_login_or_signup
    # safe check without guest creation
    if is_guest? && current_user
      # if there Was! guest this trigger ApplicationController.transfer_guest_to_user
      current_or_guest_user
    end

    # paranoid check if no current_user
    return unless current_user
    # this is needed, because there might be no guest, or guest has no spaces
    current_user.default_space || Space::CreateSpace.run!(user: current_user)
  end

  # is declared in gem device_guests
  def transfer_guest_to_user
    # TODO may be move it to transferGuest validate ?
    return unless current_user.default_space.blank?

    User::TransferGuest.run!(
      user_src: guest_user,
      user_dest: current_user
    )
  end
end
