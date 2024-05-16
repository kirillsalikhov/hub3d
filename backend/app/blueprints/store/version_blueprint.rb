# frozen_string_literal: true

class Store::VersionBlueprint < Blueprinter::Base
  identifier :id

  field :space_id
  # TODO move somewhere, repetition
  field :space_key do |o|
    o.get_space.space_key
  end

  fields :resource_id, :created_at, :updated_at
end
