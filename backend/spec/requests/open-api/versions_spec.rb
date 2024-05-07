require "swagger_helper"

RSpec.describe "api/versions" do
  path "/api/v1/versions/{id}" do
    parameter name: "id", in: :path, type: :string, description: "Version id"

    # TODO move create(:resource) to version factory
    let(:version) { create(:version, resource: create(:resource)) }
    let(:id) { version.id }

    get("show version") do
      consumes "application/json"
      produces "application/json"
      operationId "getVersion"

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

  path "/api/v1/versions/{id}/files" do
    parameter name: "id", in: :path, type: :string, description: "Version id"

    # TODO move create(:resource) to version factory
    # TODO add files Factory : HUB-3-D-T-93
    let(:version) { create(:version, resource: create(:resource)) }
    let(:id) { version.id }

    get("files version") do
      consumes "application/json"
      produces "application/json"
      operationId "getVersionFiles"

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
