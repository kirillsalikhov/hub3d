# frozen_string_literal: true

class Store::ShareOptionsBlueprint < Blueprinter::Base
  fields :link_access

  field :has_link_password do |share_options|
    share_options.link_password.present?
  end
end
