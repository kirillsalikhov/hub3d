# frozen_string_literal: true

class Store::ResourceBlueprint < Blueprinter::Base
  identifier :id
  fields :name, :created_at, :updated_at

  view :normal do
    association :share_options, blueprint: Store::ShareOptionsBlueprint
  end
end
