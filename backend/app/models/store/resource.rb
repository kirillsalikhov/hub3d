class Store::Resource < ApplicationRecord
  after_initialize :default_values,  if: :new_record?

  # TODO dependent: :destroy to versions
  has_many :versions, class_name: "Store::Version"
  belongs_to :author, class_name: "User", optional: true
  has_one :share_options, class_name: "Store::ShareOptions", dependent: :destroy

  private

  def default_values
    self.share_options ||= Store::ShareOptions.new
  end
end
