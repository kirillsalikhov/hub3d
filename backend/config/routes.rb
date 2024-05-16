Rails.application.routes.draw do
  # TODO may be make it in development only now
  # Also try to move down
  mount Rswag::Ui::Engine => "/api-docs"
  mount Rswag::Api::Engine => "/api-docs"

  devise_for :users,
    controllers: {
      sessions: "users/sessions",
      registrations: "users/registrations",
      omniauth_callbacks: "users/omniauth_callbacks"
    }
  devise_scope :user do
    # TODO delete when not needed
    # Just helper method
    get "logout" => "devise/sessions#destroy"
    # it's needed in rspec request tests
    get "simulate_guest_user" => "users/sessions#simulate_guest_user"
  end

  namespace :api do
    scope :v1 do
      post "op/convert-anonym", to: "op#convert_anonym"

      resources :conversions, only: [:index, :show] do
        member do
          get :logs
        end
      end

      resources :resources, only: [:show] do
        member do
          get "share-options", to: "share_options#show"
          patch "share-options", to: "share_options#update"
          post "share-options/auth-password", to: "share_options#auth_password"
        end
      end

      resources :versions, only: [:show] do
        member do
          get :files
        end
      end
    end
  end

  namespace :store do
    resources :resources do
      get "convert_new", on: :collection
      post "convert_create", on: :collection
    end
  end

  root "pages#root"
  scope "/s/:space_key/" do
    get "resources/:id", to: "resource#show", as: "resource"
    get "resources/:id/auth-password", to: "resource#auth_password", as: "resource_password"

    get "conversions/:id", to: "pages#conversion"
  end

  mount ActionCable.server => "/cable"
end
