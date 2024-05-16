require "swagger_helper"

RSpec.describe "users/sessions" do
  let(:user) { create(:user, :with_space) }

  path "/users/sign_in" do
    post("create session") do
      consumes "application/json"
      produces "application/json"
      operationId "signIn"
      description "Sign in user"

      parameter name: :params, in: :body,
        schema: {
          type: :object,
          required: [:email, :password],
          properties: {
            email: {type: :string, description: "User's email"},
            password: {type: :string, description: "User's password"}
          }
        }

      response(200, "successful") do
        let(:params) {
          {email: user.email, password: user.password}
        }

        after do |example|
          example.metadata[:response][:content] = {
            "application/json" => {example: json_body}
          }
        end

        run_test! do
          expect(json_body[:user][:id]).to eql(user.id)
        end
      end

      response(401, "Unauthorized") do
        let(:params) {
          {email: user.email, password: "Wrong password"}
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
end
