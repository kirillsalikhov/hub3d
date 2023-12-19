class AddCsServerToToStoreConversionTask < ActiveRecord::Migration[7.0]
  def up
    add_column :store_conversion_tasks, :cs_server, :string
    Store::ConversionTask.update_all(cs_server: "local")
  end

  def down
    remove_column :store_conversion_tasks, :cs_server
  end
end
