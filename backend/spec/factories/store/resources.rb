FactoryBot.define do
  factory :resource, class: "Store::Resource" do
    name { Faker::File.file_name(dir: "", ext: "ifc", directory_separator: "") }

    trait :with_version do
      after :create do |resource|
        create_list(:version, 1, resource: resource)
      end
    end

    trait :private do
      share_options { association(:share_options, link_access: :none, resource: instance) }
    end

    trait :public do
      share_options { association(:share_options, link_access: :view, resource: instance) }
    end

    trait :password do
      share_options {
        association(:share_options,
          link_access: :view,
          link_password: "pass8pass",
          resource: instance)
      }
    end
  end

  factory :version, class: "Store::Version" do
  end

  factory :share_options, class: "Store::ShareOptions" do
  end
end
