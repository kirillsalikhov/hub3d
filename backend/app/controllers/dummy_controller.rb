# Dummy controller for testing stuff
# will delete it soon

class DummyController < ApplicationController
  def foo
  end

  def dummy_page
    render inertia: 'Dummy', props: {}
  end
end
