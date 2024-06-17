# frozen_string_literal: true

class ApplicationBlueprint < Blueprinter::Base

  def self.space_ids
    field :space_id
    field :space_key do |o|
      o.get_space.space_key
    end
  end
end
