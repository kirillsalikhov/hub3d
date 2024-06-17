require "swagger_helper"

RSpec.describe "api/share_options" do
  let(:owner) { create(:user, :with_space) }
  let(:space) { owner.default_space }
  let("space-key") { space.space_key }  # rubocop:disable RSpec/VariableName, RSpec/VariableDefinition

  path "/api/v1/resources/{id}/share-options" do
    parameter name: "id", in: :path, type: :string, description: "Resource id"
    parameter name: "space-key", in: :header, type: :string

    let(:resource) { create(:resource, author: owner, space: space) }
    let(:share_options) { resource.share_options }

    let(:id) { resource.id }

    before {
      sign_in owner
    }

    get("show resource's share_options") do
      consumes "application/json"
      produces "application/json"
      operationId "getShareOptions"

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

    patch("update resource's share_options") do
      consumes "application/json"
      produces "application/json"
      operationId "updateShareOptions"

      parameter name: :params, in: :body, required: true,
        schema: {
          type: :object,
          properties: {
            link_access: {
              type: :string,
              description: "Resource view access by link, possible values :none, :view",
              enum: %w[none view]
            },
            link_password: {
              type: :string,
              format: :password
            }
          }
        }

      response(204, "successful") do
        let(:params) {
          {link_access: :view}
        }

        run_test! do
          share_options.reload
          expect(share_options.link_access).to eq("view")
        end
      end

      response(422, "unprocessable entity") do
        let(:params) {
          {link_access: :view, link_password: "short"}
        }

        after do |example|
          example.metadata[:response][:content] = {
            "application/json" => {example: json_body}
          }
        end

        run_test!
      end
    end
  end

  path "/api/v1/resources/{id}/share-options/auth-password" do
    parameter name: "id", in: :path, type: :string, description: "Resource id"
    parameter name: "space-key", in: :header, type: :string

    let(:another_user) { create(:user) }
    let(:resource) { create(:resource, :password, author: owner, space: space) }
    let(:share_options) { resource.share_options }

    let(:id) { resource.id }

    before {
      sign_in another_user
    }

    post("enter password for resource share_option") do
      consumes "application/json"
      produces "application/json"
      operationId "resourceAuthPassword"

      parameter name: :params, in: :body, required: true,
        schema: {
          type: :object,
          properties: {
            link_password: {
              type: :string,
              format: :password
            }
          }
        }

      def _has_access(user, resource)
        user.has_role?(:accessor_password_link, resource)
      end

      response(204, "successful") do
        let(:params) {
          {link_password: "pass8pass"}
        }

        run_test! do
          expect(_has_access(another_user, resource)).to be true
        end
      end

      response(422, "forbidden") do
        let(:params) {
          {link_password: "wrongPassword"}
        }

        run_test! do
          expect(_has_access(another_user, resource)).to be false
        end
      end
    end
  end
end
