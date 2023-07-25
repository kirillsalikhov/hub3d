class Store::Resource < ApplicationRecord
  # TODO dependent: :destroy to versions
  has_many :versions, class_name: 'Store::Version'
end
