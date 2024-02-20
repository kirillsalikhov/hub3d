module AuthConcern
  extend ActiveSupport::Concern

  def pundit_user
    return current_user if current_user
    # NOTE: not safe method, create guest_user if not exist
    return guest_user if is_guest?
    nil
  end
end
