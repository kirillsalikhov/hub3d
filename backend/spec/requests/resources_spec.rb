require "rails_helper"

RSpec.describe "ResourceController" do
  let(:author) { create(:user) }
  let(:another_user) { create(:user) }

  let(:guest) do
    get simulate_guest_user_path
    guest_id = response.body
    User.find(guest_id)
  end

  let(:private_resource) { create(:resource, :with_version, :private, author: author) }
  let(:public_resource) { create(:resource, :with_version, :public, author: author) }
  let(:password_resource) { create(:resource, :with_version, :password, author: author) }

  describe "GET /resources/:id" do
    it "can access public resource" do
      get resource_path(public_resource)
      expect(response).to have_http_status(:success)
    end

    it "forbidden for private resource" do
      get resource_path(private_resource)
      expect(response).to have_http_status(:forbidden)
    end

    context "when resource has password link" do
      subject(:request) { get resource_path(resource) }

      let(:resource) { password_resource }

      def _simulate_password_entered(user, resource)
        user.add_role(:accessor_password_link, resource)
      end

      it "redirects to auth password page if no access" do
        request
        expect(response).to redirect_to(resource_password_path(resource))
      end

      it "can access if has access" do
        sign_in author
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
end
