# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

# TODO remove this file contents

def _resource_files(path)
  Dir.glob("#{path}/**/*")
    .reject { |f| File.directory?(f) }
    .each do |f|
    yield Pathname(f)
  end
end

##
# Creates resources from db/seed/resources
# skip creation if resource with folder name already exists
#
# It's a stub function, and won't be needed for db:setup
# so it'll be removed
def create_resources
  Rails.root.join("db", "seed", "resources").each_child do |path|
    name = path.basename.to_s

    if Store::Resource.find_by(name: name)
      puts "Resource: #{name} already exists"
      next
    end

    resource = Store::Resource.create(name: name, res_type: "ivasset")
    version = resource.versions.create(ver_type: "ivasset")

    _resource_files(path) do |f_path|
      version.files.attach(
        io: File.open(f_path),
        filename: f_path.basename,
        metadata: {origin_file_path: f_path.relative_path_from(path)}
      )
    end

    puts "Resource: #{name} created with id #{resource.id}"
  end
end

# create_resources
