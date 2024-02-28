# frozen_string_literal: true

class Store::VersionBlueprint < Blueprinter::Base
  identifier :id

  fields :resource_id, :created_at, :updated_at
end
