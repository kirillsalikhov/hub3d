class Membership < ApplicationRecord
  ROLES = {
    owner: "owner",
    editor: "editor",
    collaborator: "collaborator"
  }

  belongs_to :user
  belongs_to :space

  validates :roles, presence: true

  validate :validate_roles

  def is_owner? = roles.include? ROLES[:owner]
  def is_editor? = roles.include? ROLES[:editor]
  def is_collaborator? = roles.include? ROLES[:collaborator]
  def is_member? = is_owner? || is_collaborator? || is_owner?

  def owner_level_access? = is_owner?
  def editor_level_access? = is_owner? || is_editor?
  def member_level_access? = is_owner? || is_editor? || is_collaborator?

  def grant_owner = roles << ROLES[:owner]
  def grant_editor = roles << ROLES[:editor]
  def grant_collaborator = roles << ROLES[:collaborator]

  private

  def validate_roles
    roles.each do |role|
      errors.add(:roles, "Role #{role} is not valid") unless ROLES.include?(role.to_sym)
    end

    unless roles.size == roles.uniq { |r| r.to_sym }.size
      errors.add(:roles, "Roles #{roles} have duplicate values")
    end
  end
end
