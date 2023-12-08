class Conversion::AvailableHostQuery

  COMPLEXITIES = [:low, :high]

  OPT_LIMITS = {
    "ifc" => 20_000_000,
    "fbx" => 50_000_000
  }

  RAW_LIMITS = {
    "ifc" => 50_000_000,
    "fbx" => 100_000_000
  }

  def initialize(servers = Rails.configuration.conversion_pool.servers, usage = {})
    @servers = servers.clone
    @usage = usage
  end

  def call(recipe, filename, byte_size)
    fetch_usage!
    complexity = conversion_complexity(recipe, filename, byte_size)

    fit_servers = get_servers(complexity)

    if fit_servers.any?
      server = min_usage(fit_servers)
      # if there are free servers that fit complexity
      return server if server[:usage] < 1

      # try to find free server in upper group,
      # e.g. for low complexity try high performance server
      suitable_servers = get_suitable_servers(complexity)
      min_usage(suitable_servers)
    else
      # TODO add logger message about this, when low server is used for high complexity
      # if there is now server for complexity take any
      min_usage(@servers)
    end
  end

  def conversion_complexity(recipe, filename, byte_size)
    ext = File.extname(filename).delete_prefix(".").downcase
    opt = recipe.include?("Opt")
    limits = opt ? OPT_LIMITS : RAW_LIMITS

    # we return high, because we don't know what is
    # TODO add logger when unknown
    return :high if limits[ext].nil?

    if byte_size > limits[ext]
      :high
    else
      :low
    end
  end

  private

  def get_suitable_servers(complexity)
    index = COMPLEXITIES.find_index(complexity)
    COMPLEXITIES[index..]
      .map { |c| get_servers(c) }
      .flatten
  end

  def get_servers(complexity)
    @servers.select { |s| s[:performance].to_sym == complexity }
  end

  def min_usage(servers)
    servers.min_by { |s| s[:usage] }
  end

  def fetch_usage!
    # TODO logic with ConversionTask in process count
    # TODO Use capacity
    # dummy_usage = {"local" => 1, "standbim" => 0.5}
    @servers.each { |s| s[:usage] = @usage.fetch(s[:name], 0) }
  end

end
