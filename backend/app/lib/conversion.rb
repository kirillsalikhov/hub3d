module Conversion
  class ConversionError < StandardError; end

  def self.get_servers
    Rails.configuration.conversion_pool.servers
  end

  def self.get_server(name)
    get_servers.find { |s| s[:name] == name }
  end
end
