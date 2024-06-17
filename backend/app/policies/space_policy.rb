class SpacePolicy < ApplicationPolicy
  # @return [Space]
  attr_reader :record

  protected

  def get_space = record
end
