class CreateStoreShareOptions < ActiveRecord::Migration[7.0]
  def change
    create_table :store_share_options, id: :uuid do |t|
      t.integer :link_access, default: 0
      t.string :link_password

      t.belongs_to :resource, null: false, type: :uuid

      t.timestamps
    end
  end
end
