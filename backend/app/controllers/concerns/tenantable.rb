module Tenantable
  extend ActiveSupport::Concern

  included do
    set_current_tenant_through_filter
  end

  # for classic controller
  def set_tenant_from_path
    # TODO should be no if check ???
    set_current_tenant(Space.friendly.find(params["space_key"])) if params["space_key"]
  end

  # for api controller
  def set_tenant_from_header
    space_identity = request.headers["space-id"] || request.headers["space-key"]
    set_current_tenant(Space.friendly.find(space_identity))
  end

  # for path_helper and url_helper
  def default_url_options(options = {})
    return options.merge(space_key: current_tenant.space_key) if current_tenant
    options
  end
end
