class ApplicationController < ActionController::Base
  include GuestConcern
  include Pundit::Authorization
  include AuthConcern

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  def user_not_authorized
    render status: :forbidden, html: "You do not have access to this page"
  end
end
