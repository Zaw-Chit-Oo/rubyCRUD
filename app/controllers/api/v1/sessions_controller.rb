class Api::V1::SessionsController < ApplicationController
    # class SessionsController < ApplicationController
        # before_action :redirect_if_authenticated, only: [:create, :new]
        skip_before_action :verify_authenticity_token


        def create

          # puts("========================================="+params[:email]+"==========================================")
          @user = User.find_by(email: user_params[:email])
          
            if @user && @user.authenticate(user_params[:password])
              session[:current_user_id] = @user.id
              puts("Login successfully.")
            else
              puts("Login Error")
            end
          puts(@user.inspect)

          # userSql = "select * from users";
          # @users = ActiveRecord::Base.connection.execute(userSql)
          # @user = User.find_by(email:user_params[:values][:email])
          render json: { :user => @user }
          # puts("========="+@user.inspect+"==========")
        end

      
        def destroy
          logout
          redirect_to root_path, notice: "Signed out."
        end
      
        def new
        end

        def user_params
          params[:values][:create_user] = 1
          params[:values][:update_user] = 2
          params.require(:values).permit(:id, :user_name, :email, :create_user, :update_user, :password)
        end
      
      end