class Api::V1::CustomerController < ApplicationController
  skip_before_action :verify_authenticity_token

  # データベースからデータを取得する
  def indexCustomer
    puts("==========",session[:current_user_id],"=======")
    customerSql = "select customers.id as customer_id, items.id as order_id, groups.id as group_id,
    customers.name, customers.age, customers.email, customers.address, items.name as item_name, 
    groups.name as group_name, customers.order_date, customers.remark
    from customers, items, groups where customers.order_id=items.id and
    customers.group_id=groups.id";
    @customers = ActiveRecord::Base.connection.execute(customerSql)
    @items = Item.all
    @groups = Group.all
    # ログ出力
    # config.logger = Logger.new('log/item.log', 'daily') # or 'weekly', 'monthly'  
    # logger.datetime_format = "%Y-%m-%d %H:%M:%S"
    # logger.formatter = proc do |severity, datetime, progname, msg|
    # "ItemLog: #{msg}\n"
    # end  
    # logger.debug(@items.inspect)
    # ログ出力の終わり
    render json: {
      :customers => @customers,
      :items => @items,
      :groups => @groups
  }
  end

  # Excel出力
  def index
    @customers = Customer.all;
    respond_to do |format|
      format.html
      format.xlsx {
        response.headers['Content-Disposition'] = 'attachment; filename=観客リスト.xlsx'
      }
    end
  end

  # def index
  #   @friends = Friend.all
  #   respond_to do |format|
  #     format.html
  #     format.xlsx {
  #       response.headers['Content-Disposition'] = 'attachment; filename=Friend.xlsx'
  #     }
  #   end
  # end
      # def create
      #   @beer = Beer.new(beer_params)
      #   if @beer.save
      #     render json: @beer
      #   else
      #     render json: @beer.errors
      #   end
      # end

  # データベースに観客データを保存する
  def create
    customer = Customer.create(customer_params)
    flash[:notice] = t("message.M002")
    render json: {:successMessage => flash[:notice]}
  end

  # def create
  #   @customer = Customer.new(customer_params)
  #   if @customer.save
  #     # customer = Customer.create(customer_params)
  #     flash[:notice] = t("message.M002")
  #     render json: {:successMessage => flash[:notice]}
  #   else
  #     render json: @customer.errors
  #   end
  # end

  # データベースに観客データを更新する
  def update
    customer = Customer.find(params[:id])
    customer.update(customer_params)
    flash[:notice] = t("message.M003")
    render json: {:successMessage => flash[:notice]}
  end

  # 正しいIDのデータを削除する
  def destroy
    Customer.destroy(params[:id])
    flash[:notice] = t("message.M004")
    render json: {:successMessage => flash[:notice]}
  end

  # 正しいパラメータのリストを許可する
  def customer_params
    params.require(:values).permit(:id, :name, :age, :email, :address, :order_id,:group_id, :order_date, :remark, :customer_img)
    # :customer_img
  end

end
