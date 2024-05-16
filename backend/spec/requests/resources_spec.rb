require "rails_helper"

RSpec.describe "ResourceController" do
  let(:owner) { create(:user, :with_space) }
  let(:space) { owner.default_space }

  let(:another_user) { create(:user) }

  let(:guest) do
    get simulate_guest_user_path
    guest_id = response.body
    User.find(guest_id)
  end

  let(:private_resource) { create(:resource, :with_version, :private, author: owner, space: space) }
  let(:public_resource) { create(:resource, :with_version, :public, author: owner, space: space) }
  let(:password_resource) { create(:resource, :with_version, :password, author: owner, space: space) }

  def _simulate_password_entered(user, resource)
    user.add_role(:accessor_password_link, resource)
  end

  def _resource_path(resource) = resource_path(resource.space.space_key, resource)
  def _resource_password_path(resource) = resource_password_path(resource.space.space_key, resource)

  describe "GET /resources/:id" do
    it "can access public resource" do
      get _resource_path(public_resource)
      expect(response).to have_http_status(:success)
    end

    it "forbidden for private resource" do
      get _resource_path(private_resource)
      expect(response).to have_http_status(:forbidden)
    end

    context "when resource has password link" do
      subject(:request) { get _resource_path(resource) }

      let(:resource) { password_resource }

      it "redirects to auth password page if no access" do
        request
        expect(response).to redirect_to(resource_password_path(resource))
      end

      it "can access if has access" do
        sign_in owner
        request
        expect(response).to have_http_status(:success)
      end

      it "can access another user if already entered password" do
        sign_in another_user
        _simulate_password_entered(another_user, resource)
        request
        expect(response).to have_http_status(:success)
      end

      it "guest can access if entered password" do
        _simulate_password_entered(guest, resource)
        request
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe "GET /resources/:id/auth-password" do
    it "redirect to resource page if no password link" do
      get _resource_password_path(private_resource)
      expect(response).to redirect_to(_resource_path(private_resource))
    end

    context "when resource has password link" do
      subject(:request) { get _resource_password_path(resource) }

      let(:resource) { password_resource }

      it "can access auth password page if password link" do
        request
        expect(response).to have_http_status(:success)
      end

      it "redirects to resource if has access" do
        sign_in owner
        request
        expect(response).to redirect_to(resource_path(resource))
      end

      it "redirects to resource if entered password" do
        _simulate_password_entered(guest, resource)
        request
        expect(response).to redirect_to(resource_path(resource))
      end
    end
  end
end
