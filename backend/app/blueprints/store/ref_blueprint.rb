# frozen_string_literal: true

class Store::RefBlueprint < ApplicationBlueprint
  identifier :id

  fields :src_version_id, :dest_version_id, :ref_name, :created_at, :updated_at
end
