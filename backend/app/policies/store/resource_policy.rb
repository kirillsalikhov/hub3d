class Store::ResourcePolicy < ApplicationPolicy
  # @return [Store::Resource]
  attr_reader :record

  def index?
    member_level_access?
  end

  def show?
    is_public? || member_level_access? || has_password_link_access?
  end

  def share?
    member_level_access?
  end

  def set_current? = manage?
  def convert_create? = manage?
  def convert_update? = manage?

  def manage?
    editor_level_access?
  end

  protected

  def is_public?
    record.share_options.public?
  end

  def has_password_link_access?
    return false unless record.share_options.link_with_password?
    user&.has_role?(:accessor_password_link, record)
  end
end
