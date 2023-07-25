class Store::ConversionTask < ApplicationRecord
  serialize :on_success, ServiceObjectSerializer
end
