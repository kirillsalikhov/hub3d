Rails.application.routes.draw do
  root "pages#root"

  get "/resources/:id", to: "pages#resource"
  get "/conversions/:id", to: "pages#conversion"

  namespace :api do
    scope :v1 do
      post "op/convert-anonym", to: "op#convert_anonym"

      resources :conversions do
        member do
          get :show
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
