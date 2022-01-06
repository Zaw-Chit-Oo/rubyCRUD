class AddGroupIdToCustomer < ActiveRecord::Migration[6.1]
  def change
    add_column :customers, :group_id, :integer
    add_index :customers, :group_id
  end
end
