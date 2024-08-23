# frozen_string_literal: true

class Store::ConversionTaskBlueprint < ApplicationBlueprint
  identifier :id
  space_ids

  field :progress do |task|
    task.progress.to_f
  end

  fields :status,
    :start_time,
    :end_time,
    :conversion_job_id,
    :created_at,
    :updated_at,
    :meta
end
