class AddSpaceRefsToEntities < ActiveRecord::Migration[7.0]
  def change
    add_reference :store_resources, :space, null: false, foreign_key: true, type: :uuid
    add_reference :store_conversion_tasks, :space, null: false, foreign_key: true, type: :uuid
    add_reference :store_versions, :space, null: false, foreign_key: true, type: :uuid
    add_reference :store_share_options, :space, null: false, foreign_key: true, type: :uuid
  end
end
