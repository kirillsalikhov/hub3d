class User < ApplicationRecord
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :validatable,
    :omniauthable, omniauth_providers: [:google_oauth2]

  # TODO if it's guest and it's destroyed, there will be space with no user that can be destroyed
  has_many :memberships, dependent: :destroy
  has_many :spaces, through: :memberships

  has_many :resources, class_name: "Store::Resource", foreign_key: :author_id, dependent: :nullify

  # TODO check that user has edit there
  def default_space = spaces.first
end
