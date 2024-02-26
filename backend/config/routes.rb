Rails.application.routes.draw do
  # TODO may be make it in development only now
  # Also try to move down
  mount Rswag::Ui::Engine => "/api-docs"
  mount Rswag::Api::Engine => "/api-docs"

  devise_for :users,
    controllers: {
      sessions: "users/sessions",
      registrations: "users/registrations"
    }
  devise_scope :user do
    # TODO delete when not needed
    # Just helper method
    get "logout" => "devise/sessions#destroy"
    # it's needed in rspec request tests
    get "simulate_guest_user" => "users/sessions#simulate_guest_user"
  end

  root "pages#root"

  get "/resources/:id", to: "resource#show", as: "resource"
  get "/resources/:id/auth-password", to: "resource#auth_password", as: "resource_password"
  # TODO remove this page, when logic move to component
  get "/resources/:id/edit-share-options", to: "resource#edit_share_options"

  get "/conversions/:id", to: "pages#conversion"

  namespace :api do
    scope :v1 do
      post "op/convert-anonym", to: "op#convert_anonym"

      resources :conversions, only: [:index, :show] do
        member do
          get :logs
        end
      end
      # TODO try to make resource route, when show action is ready
      patch "resources/:id/share-options", to: "share_options#update"
      post "resources/:id/share-options/auth-password", to: "share_options#auth_password" # post
    end
  end

  namespace :store do
    resources :resources do
      get "convert_new", on: :collection
      post "convert_create", on: :collection
    end
  end

  mount ActionCable.server => "/cable"
end
