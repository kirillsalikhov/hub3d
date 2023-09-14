class AddColumnToStoreConversionTask < ActiveRecord::Migration[7.0]
  def change
    add_column :store_conversion_tasks, :meta, :json
  end
end
