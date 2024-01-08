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
      redirect_to action: "resource", id: resource_id
      return
    end

    render inertia: "Conversion", props: {
      # TODO use serializer or a kind of instead of as_json
      conversionTask: conversion_task.as_json(
        except: [:on_success, :on_failure]
      ),
      resource: resource.as_json(only: [:id, :name])
    }
  end
end
