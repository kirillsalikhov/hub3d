class AddFromVersionToStoreVersion < ActiveRecord::Migration[7.0]
  def change
    add_reference :store_versions, :from_version, null: true, foreign_key: {to_table: "store_versions"}, type: :uuid
  end
end
