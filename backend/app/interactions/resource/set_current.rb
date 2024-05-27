class Resource::SetCurrent < ActiveInteraction::Base
  record :resource, class: "Store::Resource"
  record :version, class: "Store::Version"

  validate :version_belongs_to_resource

  def execute
    resource.current = version
    resource.save!
    resource
  end

  private

  # TODO move to resource (once/if divide to versions/assets )
  def version_belongs_to_resource
    errors.add(:version, "doesn't belong to resource") unless version.resource == resource
  end
end
