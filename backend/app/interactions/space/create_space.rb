class Space::CreateSpace < ActiveInteraction::Base
  record :user

  def execute
    membership = user.memberships.build
    space = Space.new

    membership.space = space
    membership.grant_owner
    membership.save!

    space
  end
end
