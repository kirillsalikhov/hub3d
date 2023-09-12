Rails.application.routes.draw do
  root 'pages#root'


  get '/resources/:id', to: 'pages#resource'

  namespace :api do
    scope :v1 do
      post 'op/convert-anonym', to: 'op#convert_anonym'
    end
  end

  namespace :store do
    resources :resources do
      get 'convert_new', on: :collection
      post 'convert_create', on: :collection

      # TODO remove
      get 'foobar', on: :collection
      get 'testjob', on: :collection
    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
end
