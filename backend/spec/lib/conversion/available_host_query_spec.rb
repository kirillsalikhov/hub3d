require "rails_helper"
require Rails.root.join("app/lib/conversion/available_host_query")

RSpec.describe Conversion::AvailableHostQuery do
  let(:low_conversion) { ["ifc2wmdOpt", "file1.ifc", 10_000_000] }
  let(:high_conversion) { ["ifc2wmdOpt", "file2.ifc", 100_000_000] }

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

  let(:low_usage!) {
    create_list(:conversion_task, 1, cs_server: "local1")
  }

  let(:average_usage!) {
    create_list(:conversion_task, 1, cs_server: "local1")
    create_list(:conversion_task, 4, cs_server: "local2")
  }

  let(:high_usage!) {
    create_list(:conversion_task, 1, cs_server: "local1")
    create_list(:conversion_task, 4, cs_server: "performant1")
  }

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

  describe "#fetch_usage!" do

    subject(:query) { described_class.new(three_servers) }

    it "handle :low_usage for :three_servers"  do
      low_usage!

      query.fetch_usage!
      expect(query.usage).to eql({"local1" => 1.0, "local2" => 0.0, "performant1" => 0.0})
    end

    it "handle :average_usage for :three_servers" do
      average_usage!

      query.fetch_usage!
      expect(query.usage).to eql({"local1" => 1.0, "local2" => 2.0, "performant1" => 0.0})
    end

    it "handle :high_usage for :three_servers" do
      high_usage!

      query.fetch_usage!
      expect(query.usage).to eql({"local1" => 1.0, "local2" => 0.0, "performant1" => 2.0})
    end
  end

  describe "#call" do

    context "when one low server" do
      subject(:query) { described_class.new(one_low_server) }

      let(:one_low_server) {
        [{
          name: "local",
          base_url: "http://manager:3000",
          performance: "low",
          capacity: 1
        }]
      }

      it "choose :low server for :low complexity conversion" do
        result = query.call(*low_conversion)
        expect(result).to eql("local")
      end

      it "choose :low server for :high complexity (because no high server in pool)" do
        result = query.call(*high_conversion)
        expect(result).to eql("local")
      end
    end

    context "when one high server" do
      subject(:query) { described_class.new(one_high_server) }

      let(:one_high_server) {
        [{
          name: "local_performant",
          base_url: "http://manager:3000",
          performance: "high",
          capacity: 1
        }]
      }

      it "choose :high server for :low complexity conversion" do
        result = query.call(*low_conversion)
        expect(result).to eql("local_performant")
      end
    end

    context "when three servers (low, low, high)" do
      subject(:query) { described_class.new(three_servers) }

      it "choose :high server for :high complexity conversion" do
        low_usage!
        result = query.call(*high_conversion)
        expect(result).to eql("performant1")
      end

      it "choose :low server for :low complexity conversion, when low available" do
        low_usage!
        result = query.call(*low_conversion)
        expect(result).to eql("local2")
      end

      it "choose :high server for :low complexity conversion, when low servers are busy" do
        average_usage!
        result = query.call(*low_conversion)
        expect(result).to eql("performant1")
      end

      it "choose :high server for :high complexity even if there are free low servers" do
        high_usage!
        result = query.call(*high_conversion)
        expect(result).to eql("performant1")
      end
    end
  end
end
