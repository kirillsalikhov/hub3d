require "rails_helper"
require Rails.root.join("app/lib/conversion/available_host_query")

RSpec.describe Conversion::AvailableHostQuery, focus: true do
  let(:low_conversion) { ["ifc2wmdOpt", "file1.ifc", 10_000_000] }
  let(:high_conversion) { ["ifc2wmdOpt", "file2.ifc", 100_000_000] }

  # TODO try to extract tests to other place
  describe "#conversion_complexity" do
    subject(:query) { described_class.new }

    def _method(params)
      query.conversion_complexity(*params)
    end

    it "return :low for ifc Opt < 20_000_000 bytes" do
      expect(_method(low_conversion)).to eq(:low)
    end

    it "return :high for ifc Opt > 20_000_000 bytes" do
      expect(_method(high_conversion)).to eq(:high)
    end

    it "return :low for fbx Opt < 50_000_000 bytes" do
      expect(_method(["fbx2wmdOpt", "f.fbx", 40_000_000])).to eq(:low)
    end

    it "return :high for fbx Opt > 50_000_000 bytes" do
      expect(_method(["fbx2wmdOpt", "f.fbx", 60_000_000])).to eq(:high)
    end

    it "return :high for Unknown ext" do
      expect(_method(["cad2wmdOpt", "f.rvt", 10_000])).to eq(:high)
    end

    it "return :low for ifc No-opt < 50_000_000 bytes" do
      expect(_method(["ifc2wmd", "f.ifc", 40_000_000])).to eq(:low)
    end

    it "return :high for ifc No-opt > 50_000_000 bytes" do
      expect(_method(["ifc2wmd", "f.ifc", 60_000_000])).to eq(:high)
    end
  end

  describe "#call" do
    def _query_new(servers, usage = {})
      described_class.new(servers, usage)
    end

    context "when one low server" do
      let(:low_servers) {
        [{
          name: "local",
          base_url: "http://manager:3000",
          performance: "low",
          capacity: 1
        }]
      }
      # TODO don't forget to change when capacity will be used
      let(:low_usage) { {"local" => 0} }

      it "choose :low server for :low complexity conversion" do
        result = _query_new(low_servers, low_usage).call(*low_conversion)
        expect(result[:name]).to eql("local")
      end

      it "choose :low server for :high complexity (because no high server in pool)" do
        result = _query_new(low_servers, low_usage).call(*high_conversion)
        expect(result[:name]).to eql("local")
      end
    end

    context "when one high server" do
      let(:low_servers) {
        [{
          name: "local_performant",
          base_url: "http://manager:3000",
          performance: "high",
          capacity: 1
        }]
      }

      let(:low_usage) { {"local" => 0} }

      it "choose :high server for :low complexity conversion" do
        result = _query_new(low_servers, low_usage).call(*low_conversion)
        expect(result[:name]).to eql("local_performant")
      end
    end

    context "when three servers (low, low, high)" do
      let(:three_servers) {
        [
          {
            name: "local1",
            base_url: "http://manager:3000",
            performance: "low",
            capacity: 1
          },
          {
            name: "local2",
            base_url: "http://manager2:3000",
            performance: "low",
            capacity: 2
          },
          {
            name: "performant1",
            base_url: "http://performant_host:3000",
            performance: "high",
            capacity: 2
          }
        ]
      }

      let(:low_usage) { {"local1" => 1, "local2" => 0, "performant" => 0} }
      let(:average_usage) { {"local1" => 1, "local2" => 2, "performant" => 0} }
      let(:high_usage) { {"local1" => 1, "local2" => 0, "performant" => 2} }

      it "choose :high server for :high complexity conversion" do
        result = _query_new(three_servers, low_usage).call(*high_conversion)
        expect(result[:name]).to eql("performant1")
      end

      it "choose :low server for :low complexity conversion, when low available" do
        result = _query_new(three_servers, low_usage).call(*low_conversion)
        expect(result[:name]).to eql("local2")
      end

      it "choose :high server for :low complexity conversion, when low servers are busy" do
        result = _query_new(three_servers, average_usage).call(*low_conversion)
        expect(result[:name]).to eql("performant1")
      end

      it "choose :high server for :high complexity even if there are free low servers" do
        result = _query_new(three_servers, high_usage).call(*high_conversion)
        expect(result[:name]).to eql("performant1")
      end
    end
  end
end
