require "rails_helper"
require Rails.root.join("app/lib/conversion/recipe")

RSpec.describe Conversion::Recipe do
  let(:ifc_small) { ["small.ifc", 4_000_000] }
  let(:ifc_big) { ["big.ifc", 6_000_000] }

  let(:fbx_small) { ["small.fbx", 15_000_000] }
  let(:fbx_big) { ["big.fbx", 21_000_000] }

  let(:rvt_small) { ["small.rvt", 4_000_000] }
  let(:rvt_big) { ["big.rvt", 6_000_000] }

  describe "#from_input" do
    subject(:recipe) { described_class }

    def _call(params) = described_class.from_input(*params)

    it "return ifc2wmd for ifc file size < 5mb" do
      expect(_call(ifc_small)).to eq("ifc2wmd")
    end

    it "return ifc2wmdOpt for ifc file size > 5mb" do
      expect(_call(ifc_big)).to eq("ifc2wmdOpt")
    end

    it "return fbx2wmd for fbx file size < 20mb" do
      expect(_call(fbx_small)).to eq("fbx2wmd")
    end

    it "return fbx2wmdOpt for fbx file size > 20mb" do
      expect(_call(fbx_big)).to eq("fbx2wmdOpt")
    end

    it "return cad2wmd for file with unknown ext and size < 5mb" do
      expect(_call(rvt_small)).to eq("cad2wmd")
    end

    it "return cad2wmdOpt for file with unknown ext and size > 5mb" do
      expect(_call(rvt_big)).to eq("cad2wmdOpt")
    end
  end
end
