class Store::Resource < ApplicationRecord
  # TODO dependent: :destroy to versions
  has_many :versions, class_name: "Store::Version"
  belongs_to :author, class_name: "User", optional: true
  has_one :share_options, class_name: "Store::ShareOptions", dependent: :destroy
end
