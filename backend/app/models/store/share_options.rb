class Store::ShareOptions < ApplicationRecord
  belongs_to :resource

  # what user can do with link only
  enum link_access: {
    none: 0, # private
    view: 1 # public
  }, _prefix: true, _scopes: false

  encrypts :link_password
end
