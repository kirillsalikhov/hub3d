FactoryBot.define do
  factory :resource, class: "Store::Resource" do
    name { Faker::File.file_name(dir: "", ext: "ifc", directory_separator: "") }
  end
end
