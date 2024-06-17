# frozen_string_literal: true

class Store::ShareOptionsBlueprint < ApplicationBlueprint
  fields :link_access
  space_ids

  field :has_link_password do |share_options|
    share_options.link_password.present?
  end
end
