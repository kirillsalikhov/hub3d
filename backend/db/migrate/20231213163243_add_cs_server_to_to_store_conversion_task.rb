class AddCsServerToToStoreConversionTask < ActiveRecord::Migration[7.0]
  def change
    add_column :store_conversion_tasks, :cs_server, :string
  end
end
