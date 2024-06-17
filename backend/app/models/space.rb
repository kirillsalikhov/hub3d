class Space < ApplicationRecord
  extend FriendlyId
  friendly_id :generate_hash_id, use: :slugged, slug_column: :space_key

  has_many :memberships
  has_many :users, through: :memberships

  def normalize_friendly_id(value)
    value.to_s.parameterize(preserve_case: true)
  end

  def membership(user_id)
    # TODO cache ?
    memberships.find_by(user_id: user_id)
  end

  private

  def generate_hash_id
    # method is called two times during creation, that's ugly, but ok for now
    loop do
      hash_id = SecureRandom
        .urlsafe_base64(6)
        .gsub(/[-_]/, ("a".."z").to_a[rand(26)])
      return hash_id unless self.class.where(space_key: hash_id).exists?
    end
  end
end
