require Rails.root.join("spec/support/active_storage_helper")

FactoryBot.define do
  factory :conversion_task, class: "Store::ConversionTask" do
    progress { 0 }
    conversion_job_id { SecureRandom.uuid }
    start_time { Time.now }
    cs_server { "local" }
    meta {
      {
        dest_resource_id: SecureRandom.uuid,
        dest_version_id: SecureRandom.uuid
      }
    }

    space

    trait :with_logs do
      after(:build) do |task|
        task.logs.attach(fixture_io("logs/success_logs.json"))
      end
    end
  end
end
