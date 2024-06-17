class Store::ShareOptionsPolicy < ApplicationPolicy
  # @return [Store::ShareOptions]
  attr_reader :record

  def show?
    # TODO check if it's possible to change to ShareOptionsPolicy.manage?
    resource_policy.show?
  end

  def auth_password?
    true
  end

  def manage?
    resource_policy.share?
  end

  def resource_policy = Pundit.policy(user, record.resource)
end
