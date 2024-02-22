describe Store::ResourcePolicy do
  subject(:policy) { described_class }

  let(:author) { create(:user) }
  let(:anon) { nil }
  let(:another_user) { create(:user) }

  let(:private_resource) { create(:resource, :private, author: author) }
  let(:public_resource) { create(:resource, :public, author: author) }
  let(:password_resource) { create(:resource, :password, author: author) }

  permissions :manage? do
    let(:resource) { public_resource }

    it "deny if anon" do
      expect(policy).not_to permit(anon, resource)
    end

    it "deny if another user" do
      expect(policy).not_to permit(another_user, resource)
    end

    it "allow if author" do
      expect(policy).to permit(author, resource)
    end
  end

  context "when resource is private" do
    let(:resource) { private_resource }

    permissions :show? do
      it "deny if anon" do
        expect(policy).not_to permit(anon, resource)
      end

      it "deny if another user" do
        expect(policy).not_to permit(another_user, resource)
      end

      it "allows if author" do
        expect(policy).to permit(author, resource)
      end
    end
  end

  context "when resource is public" do
    let(:resource) { public_resource }

    permissions :show? do
      it "allow if anon" do
        expect(policy).to permit(anon, resource)
      end

      it "allow if another_user" do
        expect(policy).to permit(another_user, resource)
      end
    end
  end

  context "when resource has link_access_password" do
    let(:resource) { password_resource }

    permissions :show? do
      it "deny if anon" do
        expect(policy).not_to permit(anon, resource)
      end

      it "deny if not entered password" do
        expect(policy).not_to permit(another_user, resource)
      end

      it "allow if entered password" do
        another_user.add_role(:accessor_password_link, resource)
        expect(policy).to permit(another_user, resource)
      end
    end
  end
end
