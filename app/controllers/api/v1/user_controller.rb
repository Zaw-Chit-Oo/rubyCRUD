class Api::V1::UserController < ApplicationController
  skip_before_action :verify_authenticity_token
  def indexUser
  end

  def index
  end

  def create
    user = User.create(user_params)
    # @user = User.new(user_params)
    # if @user.save
    #   redirect_to root_path, notice: "Please check your email for confirmation instructions."
    # else
    #   render :new, status: :unprocessable_entity
    # end
  end

  def new
    @user = User.new
  end
  # def create
  #   customer = Customer.create(customer_params)
  #   flash[:notice] = t("message.M002")
  #   render json: {:successMessage => flash[:notice]}
  # end

  def update
  end

  def destroy 
  end

  def user_params
    params[:values][:create_user] = 1
    params[:values][:update_user] = 2
    params.require(:values).permit(:id, :user_name, :email, :create_user, :update_user, :password)
  end
end
