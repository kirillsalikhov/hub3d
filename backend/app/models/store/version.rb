class Store::Version < ApplicationRecord
  belongs_to :resource, optional: true
end
