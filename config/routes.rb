Rails.application.routes.draw do
  get 'users', to: "api/v1/user#index"
  
  devise_for :users
  namespace :api do
    namespace :v1 do
      # ユーザー管理画面
      get 'user/indexUser', to: "user#indexUser"
    end
  end
  get 'home/index'
  root 'home#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  get 'customers', to: "api/v1/customer#index"
  namespace :api do
    namespace :v1 do
      # resources :customers
      get 'customers', to: 'customer#indexCustomer'
      post 'customers', to: 'customer#create'
      delete 'customers/:id', to: 'customer#destroy'
      post 'customers/update/:id', to: 'customer#update'
      # get 'customers/excel', to: 'customer#index'
      # get 'downloads/xlsx', to: 'customers#index', :as => :download_xlsx
    end
  end

end
