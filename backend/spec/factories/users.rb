FactoryBot.define do
  factory :user, class: "User" do
    email { Faker::Internet.email }
    password { Faker::Internet.password }

    # factory :guest_user do
    #   email { "guest_#{SecureRandom.uuid}@example.com" }
    #   guest { true }
    # end
  end
end
