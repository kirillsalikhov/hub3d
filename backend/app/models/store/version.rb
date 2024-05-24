class Store::Version < ApplicationRecord
  include SpaceConcern

  belongs_to :resource, optional: true, class_name: "Store::Resource"

  belongs_to :from_version,
    class_name: "Store::Version",
    optional: true,
    inverse_of: :descendants
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
end
