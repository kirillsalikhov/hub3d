class PagesController < ApplicationController
  def root
    render inertia: "Root", props: {
      uploadsPath: rails_direct_uploads_path
    }
  end

  def conversion
    conversion_task = Store::ConversionTask.find(params[:id])
    # TODO maybe move helper method on ConversionTask ?
    # TODO maybe add title computed field on conversion task ?
    resource = Store::Resource.find(conversion_task.meta
      .with_indifferent_access[:dest_resource_id])

    if conversion_task.status == Store::ConversionTask::STATUSES[:finished]
      resource_id = conversion_task.meta.with_indifferent_access[:dest_resource_id]
      redirect_to resource_path(resource_id) and return
    end

    render inertia: "Conversion", props: {
      conversionTask: Store::ConversionTaskBlueprint.render_as_hash(conversion_task),
      resource: resource.as_json(only: [:id, :name])
    }
  end
end
