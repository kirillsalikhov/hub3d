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

  def initialize(servers = Conversion.get_servers)
    @servers = servers.clone
  end

  def call(recipe, filename, byte_size)
    fetch_usage!
    complexity = conversion_complexity(recipe, filename, byte_size)

    fit_servers = get_servers(complexity)

    if fit_servers.any?
      server = min_usage(fit_servers)
      # if there are not free servers that fit complexity
      if server[:usage] >= 1
        # try to find free server in upper group,
        # e.g. for low complexity try high performance server
        suitable_servers = get_suitable_servers(complexity)
        server = min_usage(suitable_servers)
      end
    else
      # if there is no server for complexity take any
      server = min_usage(@servers)
      Rails.logger.warn "balancer: Not fit servers #{server[:performance]} performance server is used for #{complexity} complexity!"
    end
    report(complexity, server)
    server[:name]
  end

  def conversion_complexity(recipe, filename, byte_size)
    ext = File.extname(filename).delete_prefix(".").downcase
    opt = recipe.include?("Opt")
    limits = opt ? OPT_LIMITS : RAW_LIMITS

    # we return high, because we don't know what is
    if limits[ext].nil?
      Rails.logger.warn "balancer: Unknown extension #{ext}!"
      return :high
    end

    if byte_size > limits[ext]
      :high
    else
      :low
    end
  end

  def fetch_usage!
    tasks = Store::ConversionTask.in_progress_by_server
    @servers.each { |s| s[:usage] = tasks.fetch(s[:name], 0) / s[:capacity].to_f }
  end

  def usage
    @servers.to_h { |s| [s[:name], s[:usage]] }
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

  def report(complexity, server)
    Rails.logger.info "balancer [complexity]: \t #{complexity}"
    Rails.logger.info "balancer [usage]: \t #{usage}"
    Rails.logger.info "balancer [server]: \t #{server[:name]}"
  end
end
