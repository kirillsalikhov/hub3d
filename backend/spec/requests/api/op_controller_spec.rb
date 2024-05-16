require "rails_helper"

RSpec.describe "Api::OpControllers" do
  describe "POST /convert_anonym" do
    subject(:request) { post api_op_convert_anonym_path, params: params }

    before { _stub_cs }

    def resource_id = json_body[:meta][:dest_resource_id]
    def _resource = Store::Resource.find(resource_id)

    def _stub_cs
      _stub_cs_create
      _stub_schedule_cs_task
    end

    def _stub_cs_create
      fake_client = instance_double(Conversion::Client)
      allow(fake_client).to receive(:create_job)
        .and_return(SecureRandom.uuid)

      allow(Conversion::Client).to receive(:new)
        .and_return(fake_client)
    end

    def _stub_schedule_cs_task
      allow(Conversion::ConvertAnonOp).to receive(:new)
        .and_wrap_original do |method, *args|
        method.call(*args).tap do |obj|
          allow(obj).to receive(:schedule_task)
        end
      end
    end

    let(:params) {
      {input_file: fixture_blob("input_models/small.ifc").signed_id}
    }

    context "when initially anon user" do
      it "returns http success" do
        request
        expect(response).to have_http_status(:success)
      end

      it "created resource is public" do
        request
        expect(_resource.share_options.link_access).to eq("view")
      end

      it "creates guest user" do
        expect { request }.to change(User, :count).by(1)
        expect(session["guest_user_id"]).to be_present
      end

      it "assigns guest user as resource author" do
        request
        guest_user = User.find_by(email: session["guest_user_id"])
        expect(_resource.author_id).to eql(guest_user.id)
      end
    end

    context "when already guest user" do
      let!(:guest) do
        get simulate_guest_user_path
        guest_id = response.body
        User.find(guest_id)
      end

      it "doesn't create guest user" do
        expect { request }.not_to change(User, :count)
        expect(session["guest_user_id"]).to eql(guest.email)
      end
    end

    context "when already logged in user", pending: "no logged users yet"
  end
end
