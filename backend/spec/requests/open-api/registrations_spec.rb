require "swagger_helper"

RSpec.describe "users/registrations" do
  path "/users" do
    post("create registration") do
      consumes "application/json"
      produces "application/json"
      operationId "signUp"
      description "Sign up new user"

      parameter name: :params, in: :body,
        schema: {
          type: :object,
          required: [:email, :password, :password_confirmation],
          properties: {
            email: {type: :string, description: "User's email"},
            password: {type: :string, description: "User's password"},
            password_confirmation: {type: :string, description: "password confirmation, should match password"}
          }
        }

      response(200, "successful") do
        let(:params) {
          {
            email: "valid@email.com",
            password: "validPassword",
            password_confirmation: "validPassword"
          }
        }

        after do |example|
          example.metadata[:response][:content] = {
            "application/json" => {example: json_body}
          }
        end

        run_test! do
          expect(json_body[:user][:id]).to be_present
        end
      end

      response(422, "password_confirmation not match") do
        let(:params) {
          {
            email: "valid@email.com",
            password: "validPassword",
            password_confirmation: "not_match"
          }
        }

        after do |example|
          example.metadata[:response][:content] = {
            "application/json" => {example: json_body}
          }
        end

        run_test!
      end

      response(422, "password too short") do
        let(:params) {
          {
            email: "valid@email.com",
            password: "short",
            password_confirmation: "short"
          }
        }

        after do |example|
          example.metadata[:response][:content] = {
            "application/json" => {example: json_body}
          }
        end

        run_test!
      end

      response(422, "user already exist") do
        let(:existing_user) { create(:user, email: "same@email.com") }
        let(:params) {
          {
            email: existing_user.email,
            password: "validPassword",
            password_confirmation: "validPassword"
          }
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
