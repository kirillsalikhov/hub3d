class Store::ConversionTask < ApplicationRecord
  serialize :on_success, ServiceObjectSerializer

  # TODO add validation on status
  STATUSES = {
    finished: 'finished',
    in_progress: 'inProgress',
    failed: 'failed',
    canceled: 'canceled',
    canceling: 'canceling'
  }
end
