class AddVersionedResourceRefToStoreVersions < ActiveRecord::Migration[7.0]
  def change
    add_reference :store_versions, :versioned_resource, null: true, index: true, type: :uuid
  end
end
