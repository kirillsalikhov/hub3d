require "swagger_helper"

RSpec.describe "api/share_options" do
  path "/api/v1/resources/{id}/share-options" do
    parameter name: "id", in: :path, type: :string, description: "Resource id"

    let(:author) { create(:user) }
    let(:resource) { create(:resource, author: author) }
    let(:share_options) { resource.share_options }

    let(:id) { resource.id }

    before {
      sign_in author
    }

    patch("update resource's share_options") do
      consumes "application/json"
      produces "application/json"
      operationId "updateShareOptions"

      parameter name: :params, in: :body,
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
            "application/json" => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end

        run_test!
      end
    end
  end

  path "/api/v1/resources/{id}/share-options/auth-password" do
    parameter name: "id", in: :path, type: :string, description: "Resource id"

    let(:author) { create(:user) }
    let(:another_user) { create(:user) }
    let(:resource) { create(:resource, :password, author: author) }
    let(:share_options) { resource.share_options }

    let(:id) { resource.id }

    before {
      sign_in another_user
    }

    post("enter password for resource share_option") do
      consumes "application/json"
      produces "application/json"
      operationId "resourceAuthPassword"

      parameter name: :params, in: :body,
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
