module GuestConcern
  extend ActiveSupport::Concern

  included do
  end

  # Safe function to check if user is guest
  # doesn't create guest user if not exists
  #
  # @return [Boolean]
  def is_guest?
    session[:guest_user_id].present?
  end

  def transfer_guest_to_user
    puts "!!!! transfer_guest_to_user !!!!"
  end
end
