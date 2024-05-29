class CreateStoreRefs < ActiveRecord::Migration[7.0]
  def change
    create_table :store_refs, id: :uuid do |t|
      t.string :type
      t.references :src_version, null: true, index: true, type: :uuid
      t.references :dest_version, null: true, index: true, type: :uuid

      t.timestamps
    end
  end
end
