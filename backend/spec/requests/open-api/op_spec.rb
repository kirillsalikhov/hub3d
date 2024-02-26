require "swagger_helper"
require Rails.root.join("spec/support/active_storage_helper")

RSpec.describe "api/op" do
  path "/api/v1/op/convert-anonym" do
    post("convert_anonym op") do
      consumes "application/json"
      produces "application/json"
      operationId "convertAnonym"
      description "Start anonym conversion"

      # TODO add recipe

      # We don't use param for each param because of bug in rswag
      # https://github.com/rswag/rswag/issues/290#issuecomment-833199294
      parameter name: :params, in: :body,
        schema: {
          type: :object,
          required: [:input_file],
          properties: {
            input_file: {type: :string, description: "Active Storage signeID"}
          }
        }

      response(200, "successful") do
        schema "$ref" => "#/components/schemas/conversion_task"

        let(:params) {
          {input_file: fixture_blob("input_models/small-model.stp").signed_id}
        }

        before do
          # !!! STUB CS createJob, random uuid returned
          fake_client = instance_double(Conversion::Client)
          allow(fake_client).to receive(:create_job)
            .and_return(SecureRandom.uuid)

          allow(Conversion::Client).to receive(:new)
            .and_return(fake_client)

          # !!! STUB
          # To not raise error, stub schedule ConversionJob
          allow(Conversion::ConvertAnonOp).to receive(:new)
            .and_wrap_original do |method, *args|
            method.call(*args).tap do |obj|
              allow(obj).to receive(:schedule_task)
            end
          end
        end

        after do |example|
          example.metadata[:response][:content] = {
            "application/json" => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end

        run_test!
      end

      # TODO add 422 when recipe is passed
    end
  end
end
