Rails.application.routes.draw do
  # TODO may be make it in development only now
  # Also try to move down
  mount Rswag::Ui::Engine => "/api-docs"
  mount Rswag::Api::Engine => "/api-docs"

  root "pages#root"

  get "/resources/:id", to: "pages#resource"
  get "/conversions/:id", to: "pages#conversion"

  namespace :api do
    scope :v1 do
      post "op/convert-anonym", to: "op#convert_anonym"

      resources :conversions, only: [:index, :show] do
        member do
          get :logs
        end
      end
    end
  end

  namespace :store do
    resources :resources do
      get "convert_new", on: :collection
      post "convert_create", on: :collection

      # TODO remove
      get "foobar", on: :collection
      get "testjob", on: :collection
    end
  end

  mount ActionCable.server => "/cable"
end
