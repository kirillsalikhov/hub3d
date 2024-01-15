class Store::ShareOptions < ApplicationRecord
  belongs_to :resource

  # TODO add validation to link_access after rails 7.1
  # https://www.shakacode.com/blog/rails-7-1-adds-validation-to-enums/

  # what user can do with link only
  enum link_access: {
    none: 0, # private
    view: 1 # public
  }, _prefix: true, _scopes: false

  encrypts :link_password

  validates :link_password, length: {within: 8..40}, allow_blank: true

  def link_password_match?(check_password)
    return false unless link_with_password?
    link_password == check_password
  end

  def link_with_password?
    link_access != :none && link_password?
  end
end
