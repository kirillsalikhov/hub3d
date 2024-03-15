class Store::ResourcePolicy < ApplicationPolicy
  # @return [Store::Resource]
  attr_reader :record

  def show?
    is_public? || is_author? || has_password_link_access?
  end

  def share?
    # TODO should be different, collaborator should share but not manage
    # TODO may be this should be in ShareOptionsPolicy
    manage?
  end

  def manage?
    is_author?
  end

  protected

  # TODO change to access in space
  def is_author?
    user.present? && user.id == record.author_id
  end

  def is_public?
    record.share_options.public?
  end

  def has_password_link_access?
    return false unless record.share_options.link_with_password?
    user&.has_role?(:accessor_password_link, record)
  end
end
