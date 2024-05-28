class AddStatusToStoreVersion < ActiveRecord::Migration[7.0]
  def change
    add_column :store_versions, :status, :integer, default: 0
  end
end
