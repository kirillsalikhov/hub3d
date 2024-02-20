class Api::ApplicationController < ActionController::API
  include GuestConcern
  include Pundit::Authorization
  include AuthConcern

  rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity

  def render_unprocessable_entity(e)
    render json: {errors: e.record.errors}, status: :unprocessable_entity
  end
end
