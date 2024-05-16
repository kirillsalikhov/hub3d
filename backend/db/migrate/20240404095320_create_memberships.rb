class CreateMemberships < ActiveRecord::Migration[7.0]
  def change
    create_table :memberships, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :space, null: false, foreign_key: true, type: :uuid
      t.string :roles, array: true, default: []

      t.timestamps
    end
  end
end
