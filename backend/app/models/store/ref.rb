class Store::Ref < ApplicationRecord
  belongs_to :src_version, class_name: "Store::Version"
  belongs_to :dest_version, class_name: "Store::Version"

  def ref_name
    "ref"
  end
end
