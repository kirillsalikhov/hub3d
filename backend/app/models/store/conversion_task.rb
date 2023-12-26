class Store::ConversionTask < ApplicationRecord
  has_one_attached :logs
  validates :cs_server, presence: true

  scope :in_progress, -> { where(status: "inProgress") }

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
  attribute :progress, default: 0
  attribute :meta, default: {}

  serialize :on_success, ServiceObjectSerializer

  def cs_server_url = Conversion.get_server(cs_server)[:base_url]

  def self.in_progress_by_server
    in_progress.group(:cs_server).count
  end
end
