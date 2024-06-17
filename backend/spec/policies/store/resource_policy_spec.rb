describe Store::ResourcePolicy do
  subject(:policy) { described_class }

  let(:owner) { create(:user, :with_space) }
  let(:space) { owner.default_space }

  let(:editor) { _member(space, [:editor]) }
  let(:member) { _member(space, [:collaborator]) }

  let(:anon) { nil }
  let(:another_user) { create(:user) }

  let(:private_resource) { create(:resource, :private, author: owner, space: space) }
  let(:public_resource) { create(:resource, :public, author: owner, space: space) }
  let(:password_resource) { create(:resource, :password, author: owner, space: space) }

  def _member(space, roles)
    u = create(:user)
    space.memberships
      .build(user: u, roles: roles)
      .save!
    u
  end

  permissions :manage? do
    let(:resource) { public_resource }

    it "deny if anon" do
      expect(policy).not_to permit(anon, resource)
    end

    it "deny if another user" do
      expect(policy).not_to permit(another_user, resource)
    end

    it "deny if only member" do
      expect(policy).not_to permit(member, resource)
    end

    it "allow if editor or owner" do
      expect(policy).to permit(owner, resource)
      expect(policy).to permit(editor, resource)
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

      it "allows if member" do
        expect(policy).to permit(owner, resource)
        expect(policy).to permit(member, resource)
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
