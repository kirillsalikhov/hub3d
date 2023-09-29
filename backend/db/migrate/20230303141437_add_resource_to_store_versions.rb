class AddResourceToStoreVersions < ActiveRecord::Migration[7.0]
  def change
    add_reference :store_versions, :resource, null: true, foreign_key: {to_table: "store_resources"}, type: :uuid
  end
end
