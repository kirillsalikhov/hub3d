class AddAuthorToStoreResource < ActiveRecord::Migration[7.0]
  def change
    add_reference :store_resources, :author, null: true, foreign_key: { to_table: :users }, type: :uuid
  end
end
