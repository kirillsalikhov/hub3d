class ApplicationController < ActionController::Base
  include GuestConcern
  include Pundit::Authorization
  include AuthConcern


end
