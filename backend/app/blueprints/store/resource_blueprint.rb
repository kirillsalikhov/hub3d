# frozen_string_literal: true

class Store::ResourceBlueprint < Blueprinter::Base
  identifier :id
  fields :name, :created_at, :updated_at

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
