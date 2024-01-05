class CreateStoreShareOptions < ActiveRecord::Migration[7.0]
  def change
    create_table :store_share_options, id: :uuid do |t|
      t.boolean :is_public, default: false, null: false
      t.string :password
      t.belongs_to :resource, null: false, type: :uuid

      t.timestamps
    end
  end
end
