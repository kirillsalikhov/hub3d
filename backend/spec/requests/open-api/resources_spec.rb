require "swagger_helper"

RSpec.describe "api/resources" do
  path "/api/v1/resources/{id}" do
    # You'll want to customize the parameter types...
    parameter name: "id", in: :path, type: :string, description: "Resource id"

    let(:author) { create(:user) }
    let(:resource) { create(:resource, author: author) }

    let(:id) { resource.id }

    before {
      sign_in author
    }

    get("show resource") do
      consumes "application/json"
      produces "application/json"
      operationId "getResource"

      response(200, "successful") do
        after do |example|
          example.metadata[:response][:content] = {
            "application/json" => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end

        run_test!
      end
    end
  end
end
