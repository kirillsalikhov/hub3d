class TaskChannel < ApplicationCable::Channel
  def subscribed
    # TODO change to per "tasks_user"
    # TODO But there's also case when it's neede to track others conversions ?
    stream_from "task_#{params[:task]}"
    conversion_task = Store::ConversionTask.find_by(id: params[:task])
    if conversion_task.present?
        transmit({
          operation: :update,
          record: conversion_task.as_json(except: [:on_success, :on_failure])
        })
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
