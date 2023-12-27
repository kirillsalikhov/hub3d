class TaskChannel < ApplicationCable::Channel
  def subscribed
    # TODO change to per "tasks_user"
    # TODO But there's also case when it's neede to track others conversions ?
    stream_from "task_#{params[:task]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
