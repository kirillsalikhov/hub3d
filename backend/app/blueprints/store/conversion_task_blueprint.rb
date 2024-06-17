# frozen_string_literal: true

class Store::ConversionTaskBlueprint < ApplicationBlueprint
  identifier :id
  space_ids

  fields :status,
    :progress,
    :start_time,
    :end_time,
    :conversion_job_id,
    :created_at,
    :updated_at,
    :meta
end
