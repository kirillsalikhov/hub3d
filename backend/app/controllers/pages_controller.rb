class PagesController < ApplicationController
  def root
    render_ssr({uploadsPath: rails_direct_uploads_path})
  end

  def conversion
    conversion_task = Store::ConversionTask.find(params[:id])

    # TODO maybe helper is_finished or so ?
    if conversion_task.status == Store::ConversionTask::STATUSES[:finished]
      # TODO maybe move helper method on ConversionTask ?
      resource_id = conversion_task.meta.with_indifferent_access[:dest_resource_id]
      redirect_to resource_path(resource_id) and return
    end

    render_page
  end
end
