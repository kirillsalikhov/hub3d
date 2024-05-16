class Store::ResourcePolicy < ApplicationPolicy
  # @return [Store::Resource]
  attr_reader :record

  def show?
    is_public? || is_member? || has_password_link_access?
  end

  def share?
    # TODO should be different, collaborator should share but not manage
    # TODO may be this should be in ShareOptionsPolicy
    manage?
  end

  def manage?
    is_member?
  end

  protected

  def is_member?
    membership&.is_member?
  end

  # @return [Membership]
  def membership
    return nil unless user
    # TODO investigate
    # might be issues if no membership
    @membership ||= record.get_space.membership(user.id)
  end

  def is_public?
    record.share_options.public?
  end

  def has_password_link_access?
    return false unless record.share_options.link_with_password?
    user&.has_role?(:accessor_password_link, record)
  end
end
