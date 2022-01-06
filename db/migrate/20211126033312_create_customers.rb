class CreateCustomers < ActiveRecord::Migration[6.1]
  def change
    create_table :customers do |t|
      t.string :name
      t.string :address
      t.integer :age
      t.string :email
      t.string :order_item
      t.string :remark

      t.timestamps
    end
  end
end
