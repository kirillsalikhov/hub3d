class Store::ResourcePolicy < ApplicationPolicy

  # @return [Store::Resource]
  attr_reader :record

  def show?
    is_public? || is_author? || has_password_link_access?
  end

  def is_author?
    user && user == record.author
  end

  def is_public?
    record.share_options.public?
  end

  def has_password_link_access?
    return false unless record.share_options.link_with_password?
    user&.has_role?(:accessor_password_link, record)
  end

  class Scope < Scope
    # NOTE: Be explicit about which records you allow access to!
    # def resolve
    #   scope.all
    # end
  end
end
