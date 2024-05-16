class AddSpaceKeyToSpace < ActiveRecord::Migration[7.0]
  def change
    add_column :spaces, :space_key, :string
    add_index :spaces, :space_key, unique: true
  end
end
