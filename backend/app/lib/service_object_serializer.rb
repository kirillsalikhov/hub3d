class ServiceObjectSerializer
  def self.dump(value)
    ActiveSupport::JSON.encode({
      class_name: value.class.name,
      context: value.context.to_h
    })
  end

  def self.load(value)
    return {} if value.blank?

    data = ActiveSupport::JSON.decode(value).with_indifferent_access

    data[:class_name].constantize.new(data[:context])
  end
end
