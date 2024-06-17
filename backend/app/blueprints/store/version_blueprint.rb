# frozen_string_literal: true

class Store::VersionBlueprint < ApplicationBlueprint
  identifier :id
  space_ids

  fields :resource_id, :status, :is_version, :created_at, :updated_at
end
