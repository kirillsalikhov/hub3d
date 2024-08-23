require "oj"

Oj.optimize_rails

Blueprinter.configure do |config|
  config.generator = Oj
  config.sort_fields_by = :definition
end
