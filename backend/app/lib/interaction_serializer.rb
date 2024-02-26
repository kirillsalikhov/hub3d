class InteractionSerializer
  def self.dump(interaction)
    unless interaction.class < SerializableInteraction
      raise StandardError("Interaction doesn't include Concerns::SerializableInteraction")
    end

    ActiveSupport::JSON.encode({
      class_name: interaction.class.name,
      inputs: interaction.inputs.to_h
    })
  end

  def self.load(value)
    return {} if value.blank?

    data = ActiveSupport::JSON.decode(value).with_indifferent_access

    data[:class_name].constantize.new(data[:inputs])
  end
end
