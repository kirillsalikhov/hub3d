FactoryBot.define do
  factory :user, class: "User" do
    email { Faker::Internet.email }
    password { Faker::Internet.password }

    trait :with_space do
      after :create do |resource|
        Space::CreateSpace.run!(user: resource)
      end
    end
    # factory :guest_user do
    #   email { "guest_#{SecureRandom.uuid}@example.com" }
    #   guest { true }
    # end
  end
end
