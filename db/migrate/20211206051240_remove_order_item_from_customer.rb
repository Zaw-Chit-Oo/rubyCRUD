class RemoveOrderItemFromCustomer < ActiveRecord::Migration[6.1]
  def change
    remove_column :customers, :order_item, :string
  end
end
