require "swagger_helper"

RSpec.describe "api/resources" do
  let(:owner) { create(:user, :with_space) }
  let(:space) { owner.default_space }
  let("space-key") { space.space_key }  # rubocop:disable RSpec/VariableName, RSpec/VariableDefinition

  path "/api/v1/resources/{id}" do
    # You'll want to customize the parameter types...
    parameter name: "id", in: :path, type: :string, description: "Resource id"
    parameter name: "space-key", in: :header, type: :string

    let(:resource) { create(:resource, author: owner, space: space) }

    let(:id) { resource.id }

    before {
      sign_in owner
    }

    get("show resource") do
      consumes "application/json"
      produces "application/json"
      operationId "getResource"

      response(200, "successful") do
        after do |example|
          example.metadata[:response][:content] = {
            "application/json" => {example: json_body}
          }
        end

        run_test! do
          expect(json_body[:space_key]).to eql(space.space_key)
        end
      end
    end
  end
end
