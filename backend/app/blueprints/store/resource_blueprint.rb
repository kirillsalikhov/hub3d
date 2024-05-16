# frozen_string_literal: true

class Store::ResourceBlueprint < Blueprinter::Base
  identifier :id

  field :space_id
  # TODO move somewhere, repetition
  field :space_key do |o|
    o.get_space.space_key
  end

  fields :name, :created_at, :updated_at

  # TODO ! should be fields in resource table
  field :current_id do |resource|
    # TODO remove extra request
    resource.versions.first&.id
  end

  view :_permissions do
    field :permissions do |resource, options|
      policy = Pundit.policy!(options[:user], resource)
      {
        manage: policy.manage?,
        share: policy.share?
      }
    end
  end

  view :normal do
    include_view :_permissions
    association :share_options, blueprint: Store::ShareOptionsBlueprint
  end
end
