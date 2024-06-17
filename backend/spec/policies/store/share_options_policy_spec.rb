describe Store::ShareOptionsPolicy do
  subject(:policy) { described_class }

  let(:owner) { create(:user, :with_space) }
  let(:space) { owner.default_space }

  let(:editor) { _member(space, [:editor]) }
  let(:member) { _member(space, [:collaborator]) }

  let(:anon) { nil }

  let(:private_resource) { create(:resource, :private, author: owner, space: space) }
  let(:public_resource) { create(:resource, :public, author: owner, space: space) }

  # TODO repetition, move to helper when repeats again
  def _member(space, roles)
    u = create(:user)
    space.memberships
      .build(user: u, roles: roles)
      .save!
    u
  end

  permissions :manage? do
    let(:share_options) { public_resource.share_options }

    it "denied if anon" do
      expect(policy).not_to permit(anon, share_options)
    end

    it "allowed if member" do
      expect(policy).to permit(member, share_options)
    end
  end

  context "when resource is private" do
    let(:share_options) { private_resource.share_options }

    permissions :show? do
      it "denied if anon" do
        expect(policy).not_to permit(anon, share_options)
      end

      it "allowed if member" do
        expect(policy).to permit(member, share_options)
      end
    end
  end

  context "when resource is public" do
    let(:share_options) { public_resource.share_options }

    permissions :show? do
      it "allowed if anon" do
        expect(policy).to permit(anon, share_options)
      end

      it "allowed if member" do
        expect(policy).to permit(member, share_options)
      end
    end
  end
end
