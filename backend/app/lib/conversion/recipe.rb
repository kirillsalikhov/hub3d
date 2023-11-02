module Conversion::Recipe
  def self.from_input(filename)
    ext = File.extname(filename).downcase
    case ext
    when ".ifc"
      "ifc2wmd"
    when ".fbx"
      "fbx2wmd"
    else
      "cad2wmd"
    end
  end
end
