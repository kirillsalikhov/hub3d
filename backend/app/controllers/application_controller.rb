class ApplicationController < ActionController::Base
  include Tenantable
  before_action :set_tenant_from_path

  include GuestConcern
  include Pundit::Authorization
  include AuthConcern

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  def user_not_authorized
    render status: :forbidden, html: "You do not have access to this page"
  end

  def render_ssr(locals = nil)
    uri = URI("http://frontend:13714#{request.fullpath}")
    body = Rails.env.production? ?
      File.read("public/vite-ssr/#{params[:action]}.html") :
      Net::HTTP.get(uri, "Content-Type" => "application/json", "Cookie" => request.headers["Cookie"])
    render html: body.html_safe, layout: "application-ssr", locals: {page: locals}
  end

  def render_page(locals = nil)
    render html: "", layout: "application", locals: {page: locals}
  end
end
