class Store::ConversionTask < ApplicationRecord
  # TODO add validation on status
  # TODO Move out here, think about it
  STATUSES = {
    finished: "finished",
    in_progress: "inProgress",
    failed: "failed",
    canceled: "canceled",
    canceling: "canceling"
  }

  attribute :status, default: STATUSES[:in_progress]
  attribute :meta, default: {}

  serialize :on_success, ServiceObjectSerializer
end
