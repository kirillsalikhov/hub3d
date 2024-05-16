class TaskChannel < ApplicationCable::Channel
  def subscribed
    # TODO check tenant ?

    # TODO change to per "tasks_user"
    # TODO But there's also case when it's neede to track others conversions ?
    stream_from "task_#{params[:task]}"
    conversion_task = Store::ConversionTask.find_by(id: params[:task])
    if conversion_task.present?
      transmit({
        operation: :update,
        record: Store::ConversionTaskBlueprint.render(conversion_task)
      })
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
