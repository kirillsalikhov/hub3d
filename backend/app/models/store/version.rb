class Store::Version < ApplicationRecord
  include SpaceConcern

  belongs_to :resource, optional: true, class_name: "Store::Resource"
  has_many_attached :files
end
