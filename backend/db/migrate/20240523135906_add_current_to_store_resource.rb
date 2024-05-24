class AddCurrentToStoreResource < ActiveRecord::Migration[7.0]
  def change
    add_reference :store_resources, :current, null: true, foreign_key: {to_table: "store_versions"}, type: :uuid
  end
end
