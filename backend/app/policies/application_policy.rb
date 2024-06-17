# frozen_string_literal: true

require "singleton"

class ApplicationPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def index?
    false
  end

  def show?
    false
  end

  def create?
    manage?
  end

  def new?
    manage?
  end

  def update?
    manage?
  end

  def edit?
    manage?
  end

  def destroy?
    manage?
  end

  def manage?
    false
  end

  def is_guest?
    user&.guest
  end

  class Scope
    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      raise NotImplementedError, "You must define #resolve in #{self.class}"
    end

    private

    attr_reader :user, :scope
  end

  class NullMembership
    include Singleton

    def owner_level_access? = false
    def editor_level_access? = false
    def member_level_access? = false
  end

  delegate :owner_level_access?,
    :editor_level_access?,
    :member_level_access?, to: :membership

  protected

  # @return [Membership]
  def membership
    return NullMembership.instance unless user
    # TODO investigate, also probably cache inside space
    # might be issues if no membership
    @membership ||= get_space.membership(user.id) || NullMembership.instance
  end

  def get_space = record.get_space
end
