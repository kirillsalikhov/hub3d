require "swagger_helper"

RSpec.describe "api/versions" do
  let(:owner) { create(:user, :with_space) }
  let(:space) { owner.default_space }
  let("space-key") { space.space_key }  # rubocop:disable RSpec/VariableName, RSpec/VariableDefinition

  path "/api/v1/versions/{id}" do
    parameter name: "id", in: :path, type: :string, description: "Version id"
    parameter name: "space-key", in: :header, type: :string

    let(:resource) { create(:resource, author: owner, space: space) }
    # TODO move create(:resource) to version factory, remove let resource
    let(:version) { create(:version, resource: resource, space: space) }
    let(:id) { version.id }

    # TODO add auth to test

    get("show version") do
      consumes "application/json"
      produces "application/json"
      operationId "getVersion"

      response(200, "successful") do
        after do |example|
          example.metadata[:response][:content] = {
            "application/json" => {example: json_body}
          }
        end

        run_test!
      end
    end
  end

  path "/api/v1/versions/{id}/files" do
    parameter name: "id", in: :path, type: :string, description: "Version id"
    parameter name: "space-key", in: :header, type: :string

    # TODO add auth to test

    let(:resource) { create(:resource, author: owner, space: space) }
    # TODO move create(:resource) to version factory
    # TODO add files Factory : HUB-3-D-T-93
    let(:version) { create(:version, resource: resource, space: space) }
    let(:id) { version.id }

    get("files version") do
      consumes "application/json"
      produces "application/json"
      operationId "getVersionFiles"

      response(200, "successful") do
        after do |example|
          example.metadata[:response][:content] = {
            "application/json" => {example: json_body}
          }
        end

        run_test!
      end
    end
  end
end
