class Store::Version < ApplicationRecord
  include SpaceConcern

  enum status: {pending: 0, in_progress: 1, ready: 2, failed: 3, canceled: 4}

  # TODO remove optional ?
  belongs_to :resource, optional: true, class_name: "Store::Resource"
  belongs_to :versioned_resource, optional: true, class_name: "Store::Resource"

  belongs_to :from_version, class_name: "Store::Version", optional: true, inverse_of: :descendants
  has_many :descendants,
    class_name: "Store::Version",
    foreign_key: "from_version_id",
    dependent: :nullify,
    inverse_of: :from_version

  # NOTE is used for nullify (which is doubtful)
  has_one :is_current_of,
    class_name: "Store::Resource",
    foreign_key: "current_id",
    dependent: :nullify,
    inverse_of: :current

  has_many_attached :files

  # TODO add dependent destroy ?
  has_many :refs, class_name: "Store::Ref", foreign_key: "src_version_id"
  has_many :refs_from, class_name: "Store::Ref", foreign_key: "dest_version_id"

  def is_version = versioned_resource_id.present?
end
