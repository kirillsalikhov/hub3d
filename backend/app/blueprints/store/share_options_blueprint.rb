# frozen_string_literal: true

class Store::ShareOptionsBlueprint < Blueprinter::Base
  fields :link_access

  field :space_id
  # TODO move somewhere, repetition
  field :space_key do |o|
    o.get_space.space_key
  end

  field :has_link_password do |share_options|
    share_options.link_password.present?
  end
end
