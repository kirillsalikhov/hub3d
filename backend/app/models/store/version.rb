class Store::Version < ApplicationRecord
  # TODO think about it, do we need it ... and probably there is easier way
  self.implicit_order_column = "created_at"

  belongs_to :resource, optional: true, class_name: "Store::Resource"
  has_many_attached :files
end
