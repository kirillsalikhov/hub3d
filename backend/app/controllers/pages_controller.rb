class PagesController < ApplicationController
  def root
    render inertia: 'Root', props: {}
  end
end
