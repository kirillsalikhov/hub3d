require "swagger_helper"

RSpec.describe "api/resources" do
  let(:owner) { create(:user, :with_space) }
  let(:space) { owner.default_space }
  let("space-key") { space.space_key }  # rubocop:disable RSpec/VariableName, RSpec/VariableDefinition

  path "/api/v1/resources/" do
    parameter name: "space-key", in: :header, type: :string

    get("list resources") do
      consumes "application/json"
      produces "application/json"
      operationId "getResources"

      before { create_list(:resource, 3, space: space) }

      response(200, "successful") do
        after do |example|
          example.metadata[:response][:content] = {
            "application/json" => {example: json_body}
          }
        end

        run_test! do
          expect(json_body.pluck(:space_key)).to all(eql(space.space_key))
        end
      end
    end
  end

  path "/api/v1/resources/{id}" do
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

    delete("delete resource") do
      consumes "application/json"
      produces "application/json"
      operationId "deleteResource"

      response(204, "successful") do
        run_test! do
          expect(Store::Resource.exists?(resource.id)).to be false
        end
      end
    end
  end

  path "/api/v1/resources/convert_create" do
    parameter name: "space-key", in: :header, type: :string

    before {
      sign_in owner
    }

    post("convert_create resource") do
      consumes "application/json"
      produces "application/json"
      operationId "convertCreateResource"
      description "Create new Resource through conversion, Resource.current version is not ready"

      parameter name: :params, in: :body, required: true,
        schema: {
          type: :object,
          required: [:input_file],
          properties: {
            input_file: {type: :string, description: "Active Storage signeID"}
          }
        }

      response(200, "successful") do

        let(:params) {
          {input_file: fixture_blob("input_models/small-model.stp").signed_id}
        }

        before { stub_cs }

        after do |example|
          example.metadata[:response][:content] = {
            "application/json" => {example: json_body}
          }
        end

        run_test! do
          resource = Store::Resource.find(json_body[:resource][:id])
          expect(resource.current.persisted?).to be true
          expect(json_body[:task][:status]).to eql("inProgress")
        end
      end
    end
  end

  path "/api/v1/resources/{id}/convert_update" do
    parameter name: "id", in: :path, type: :string, description: "Resource id"
    parameter name: "space-key", in: :header, type: :string

    post("convert_update resource") do
      consumes "application/json"
      produces "application/json"
      operationId "convertUpdateResource"
      description "Create new Version through conversion, Resource.current version is not changed"

      parameter name: :params, in: :body, required: true,
        schema: {
          type: :object,
          required: [:input_file],
          properties: {
            input_file: {type: :string, description: "Active Storage signeID"}
          }
        }

      response(200, "successful") do

        let(:resource) { create(:resource, :with_version, author: owner, space: space) }
        let(:id) { resource.id }
        let(:params) {
          {input_file: fixture_blob("input_models/small-model.stp").signed_id}
        }

        before { stub_cs }

        after do |example|
          example.metadata[:response][:content] = {
            "application/json" => {example: json_body}
          }
        end

        run_test! do
          resource = Store::Resource.find(json_body[:version][:resource_id])
          expect(resource.current_id).not_to eql(json_body[:version][:id])

          expect(json_body[:version][:status]).to eql("pending")
          expect(json_body[:task][:status]).to eql("inProgress")
        end
      end
    end
  end

  path "/api/v1/resources/{id}/set_current" do
    parameter name: "id", in: :path, type: :string, description: "Resource id"
    parameter name: "space-key", in: :header, type: :string

    patch("set_current resource") do
      consumes "application/json"
      produces "application/json"
      operationId "setResourceCurrent"
      description "Change current resource version"

      parameter name: :params, in: :body, required: true,
        schema: {
          type: :object,
          required: [:current_id],
          properties: {
            current_id: {type: :string, description: "New Resource current id, if on one of resource versions"}
          }
        }

      response(200, "successful") do

        let(:resource) { create(:resource, :with_versions, author: owner, space: space) }
        let(:id) { resource.id }
        let(:params) { {current_id: resource.versions.last.id } }

        after do |example|
          example.metadata[:response][:content] = {
            "application/json" => {example: json_body}
          }
        end

        run_test! do
          expect(json_body[:current_id]).to be_present
          expect(resource.current_id).not_to eql(json_body[:current_id])
        end
      end
    end
  end

end
