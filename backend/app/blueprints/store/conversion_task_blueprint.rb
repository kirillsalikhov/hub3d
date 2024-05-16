# frozen_string_literal: true

class Store::ConversionTaskBlueprint < Blueprinter::Base
  identifier :id

  field :space_id
  # TODO move somewhere, repetition
  field :space_key do |o|
    o.get_space.space_key
  end

  fields :status,
    :progress,
    :start_time,
    :end_time,
    :conversion_job_id,
    :created_at,
    :updated_at,
    :meta
end
