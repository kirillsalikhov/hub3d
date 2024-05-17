class DashboardController < ApplicationController
  def index
    # TODO authorize @space
    render_page
  end
end
