require "swagger_helper"

RSpec.describe "api/conversions" do
  path "/api/v1/conversions" do
    get("List conversions") do
      consumes "application/json"
      produces "application/json"
      operationId "getConversions"
      description "List conversion tasks for user"

      response(200, "successful") do
        schema type: :array, items: {"$ref" => "#/components/schemas/conversion_task"}

        before { create_list(:conversion_task, 2) }

        after do |example|
          content = example.metadata[:response][:content] || {}
          example_spec = {
            "application/json" => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
          example.metadata[:response][:content] = content.deep_merge(example_spec)
        end

        run_test!
      end
    end
  end

  path "/api/v1/conversions/{id}" do
    # You'll want to customize the parameter types...
    parameter name: "id", in: :path, type: :string, description: "id"

    get("show conversion") do
      consumes "application/json"
      produces "application/json"
      operationId "getConversion"
      description "Get description of Conversion Task"

      # TODO add not found when exceptions are ready

      response(200, "successful") do
        schema "$ref" => "#/components/schemas/conversion_task"

        let(:task) { create(:conversion_task) }
        let(:id) { task.id }

        after do |example|
          content = example.metadata[:response][:content] || {}
          example_spec = {
            "application/json" => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
          example.metadata[:response][:content] = content.deep_merge(example_spec)
        end

        run_test!
      end
    end
  end

  path "/api/v1/conversions/{id}/logs" do
    # You'll want to customize the parameter types...
    parameter name: "id", in: :path, type: :string, description: "Conversion Task id"

    get("logs conversion") do
      consumes "application/json"
      produces "application/json"
      operationId "getConversionLogs"
      description "Get logs of Conversion Task (redirect to logs file)"

      # TODO add not found when exceptions are ready

      response(302, "successful") do
        let(:task) { create(:conversion_task, :with_logs) }
        let(:id) { task.id }

        run_test! do |response|
          expect(response.location).not_to be_empty
        end
      end
    end
  end
end
