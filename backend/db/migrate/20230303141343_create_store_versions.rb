class CreateStoreVersions < ActiveRecord::Migration[7.0]
  def change
    create_table :store_versions, id: :uuid do |t|
      t.string :ver_type

      t.timestamps
    end
  end
end
