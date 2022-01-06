class AddOrderDateToCustomer < ActiveRecord::Migration[6.1]
  def change
    add_column :customers, :order_date, :date
  end
end
