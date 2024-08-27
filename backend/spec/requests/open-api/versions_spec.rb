require "swagger_helper"

RSpec.describe "api/versions" do
  let(:owner) { create(:user, :with_space) }
  let(:space) { owner.default_space }
  let("space-key") { space.space_key } # rubocop:disable RSpec/VariableName, RSpec/VariableDefinition

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
        schema "$ref" => "#/components/schemas/version"

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
        schema type: :array, items: {"$ref" => "#/components/schemas/asset_file"}

        after do |example|
          example.metadata[:response][:content] = {
            "application/json" => {example: json_body}
          }
        end

        run_test!
      end
    end
  end

  path "/api/v1/resources/{id}/versions" do
    parameter name: "id", in: :path, type: :string, description: "Resource id"
    parameter name: "space-key", in: :header, type: :string

    let(:resource) { create(:resource, :with_versions, author: owner, space: space) }

    let(:id) { resource.id }

    get("get versions") do
      consumes "application/json"
      produces "application/json"
      operationId "getResourceVersions"
      description "Resource versions, asset items each of which is versioned representation of resource"

      response(200, "successful") do
        schema type: :array, items: {"$ref" => "#/components/schemas/version"}

        after do |example|
          example.metadata[:response][:content] = {
            "application/json" => {example: json_body}
          }
        end

        run_test! do
          expect(json_body.size).to be(3)
          expect(json_body.pluck(:is_version)).to all(eql(true))
        end
      end
    end
  end

  path "/api/v1/resources/{id}/asset-items" do
    parameter name: "id", in: :path, type: :string, description: "Version id"
    parameter name: "space-key", in: :header, type: :string

    let(:resource) { create(:resource, :with_versions, author: owner, space: space) }
    let(:id) { resource.id }

    get("get asset items") do
      consumes "application/json"
      produces "application/json"
      operationId "getResourceAssetItems"
      description "Resource asset items, not only versions"

      response(200, "successful") do
        schema type: :array, items: {"$ref" => "#/components/schemas/version"}

        after do |example|
          example.metadata[:response][:content] = {
            "application/json" => {example: json_body}
          }
        end

        run_test! do
          expect(json_body.size).to be(6)
          expect(json_body.count { |v| v[:is_version] }).to be 3
          expect(json_body.count { |v| !v[:is_version] }).to be 3
        end
      end
    end
  end

end
