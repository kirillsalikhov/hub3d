class DashboardController < ApplicationController
  def index
    # TODO authorize @space
    render_page({uploadsPath: rails_direct_uploads_path})
  end
end
