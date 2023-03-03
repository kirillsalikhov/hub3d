class CreateStoreResources < ActiveRecord::Migration[7.0]
  def change
    create_table :store_resources, id: :uuid do |t|
      t.string :name
      t.string :res_type

      t.timestamps
    end
  end
end
