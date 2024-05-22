class Resource::Destroy < ActiveInteraction::Base
  record :resource, class: "Store::Resource"

  def execute
    resource.destroy
  end
end
