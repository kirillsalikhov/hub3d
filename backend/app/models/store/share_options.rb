class Store::ShareOptions < ApplicationRecord
  belongs_to :resource

  enum link_access: {
    private: 0,
    public: 1,
    password: 2
  }, _prefix: true, _scopes: false

  encrypts :link_password
end
