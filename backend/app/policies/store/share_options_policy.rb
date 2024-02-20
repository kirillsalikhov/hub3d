class Store::ShareOptionsPolicy < ApplicationPolicy

  # @return [Store::ShareOptions]
  attr_reader :record

  def auth_password?
    true
  end

  def manage?
    Pundit.policy(user, record.resource).manage?
  end
end
