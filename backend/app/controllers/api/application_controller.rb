class Api::ApplicationController < ActionController::API
  include Tenantable
  before_action :set_tenant_from_header

  include GuestConcern
  include Pundit::Authorization
  include AuthConcern

  rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity
  rescue_from Pundit::NotAuthorizedError, with: :deny_access

  private

  def render_unprocessable_entity(e)
    print_stack_trace(e)
    render json: {errors: e.record.errors}, status: :unprocessable_entity
  end

  def deny_access(e)
    head :forbidden
  end

  def print_stack_trace(e)
    return unless Rails.env.development?
    # logger.error ([e.message] + e.backtrace).join($/)
    logger.error [e.message, *e.backtrace].join("\n")
  end
end
