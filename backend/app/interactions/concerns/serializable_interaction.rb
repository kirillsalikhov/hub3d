# This module is needed because active interaction is intended to be used without new
# and methods run, run! are private
module SerializableInteraction
  def self.included(base)
    base.send :public, :run!
  end
end
