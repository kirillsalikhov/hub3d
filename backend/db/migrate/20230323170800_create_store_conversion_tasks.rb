class CreateStoreConversionTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :store_conversion_tasks, id: :uuid do |t|
      t.string :status
      t.decimal :progress
      t.text :on_success
      t.text :on_failure
      t.datetime :start_time
      t.datetime :end_time
      t.string :conversion_job_id

      t.timestamps
    end
  end
end
