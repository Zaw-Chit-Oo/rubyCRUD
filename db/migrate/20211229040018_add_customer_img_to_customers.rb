class AddCustomerImgToCustomers < ActiveRecord::Migration[6.1]
  def change
    add_column :customers, :customer_img, :string
  end
end
