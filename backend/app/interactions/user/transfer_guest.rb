class User::TransferGuest < ActiveInteraction::Base
  object :user_src, class: "User"
  object :user_dest, class: "User"

  # TODO test
  def execute
    transfer_spaces
    transfer_authority
    transfer_rolify_access
    user_src.reload
  end

  private

  def transfer_spaces
    # move up
    Membership.transaction do
      Membership
        .includes(:space)
        .where(user: user_src)
        .find_each do |membership|
          membership.user = user_dest
          membership.save!
        end
    end
  end

  def transfer_authority
    Store::Resource.transaction do
      Store::Resource
        .where(author_id: user_src.id)
        .update_all(author_id: user_dest.id)
    end
  end

  def transfer_rolify_access
    Role.transaction do
      user_src.roles.each do |role|
        role.users.delete(user_src)
        role.users << user_dest
      end
    end
  end
end
