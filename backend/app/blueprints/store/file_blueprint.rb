# frozen_string_literal: true

class Store::FileBlueprint < Blueprinter::Base
  field :filename
  field :byte_size, name: :size

  # NOTE: beware of caching, also sign url takes long time
  field :signedUrl do |f|
    f.url(expires_in: 1.hour)
  end

  field :originFilePath do |f|
    f.blob.metadata[:origin_file_path]
  end
end
