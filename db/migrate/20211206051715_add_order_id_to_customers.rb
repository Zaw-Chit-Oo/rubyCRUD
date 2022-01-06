class AddOrderIdToCustomers < ActiveRecord::Migration[6.1]
  def change
    add_column :customers, :order_id, :integer
    add_index :customers, :order_id
  end
end
