module SpaceConcern
  extend ActiveSupport::Concern

  included do
    acts_as_tenant :space
  end

  def get_space
    active_space = ActsAsTenant.current_tenant
    return active_space if active_space&.id == space_id
    # NOTE potential extra request, or n+1
    space
  end
end
