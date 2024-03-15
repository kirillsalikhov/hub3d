module Conversion::Recipe
  LIMITS = {
    "ifc" => 5_000_000,
    "fbx" => 20_000_000,
    "unknown" => 5_000_000
  }

  def self.from_input(filename, byte_size)
    ext = File.extname(filename).delete_prefix(".").downcase
    limit = LIMITS.fetch(ext, LIMITS["unknown"])
    case ext
    when "ifc"
      (byte_size < limit) ? "ifc2wmd_node" : "ifc2wmdOpt_node"
    when "fbx"
      (byte_size < limit) ? "fbx2wmd" : "fbx2wmdOpt"
    else
      (byte_size < limit) ? "cad2wmd" : "cad2wmdOpt"
    end
  end
end
