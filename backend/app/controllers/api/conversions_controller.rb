class Api::ConversionsController < Api::ApplicationController
  def index
    # TODO get tasks only visible to user
    tasks = Store::ConversionTask.all
    render json: tasks, except: [:on_success, :on_failure]
  end

  def show
    task = Store::ConversionTask.find(params[:id])
    render json: task, except: [:on_success, :on_failure]
  end

  def logs
    task = Store::ConversionTask.with_attached_logs.find(params[:id])
    if task.logs.blank?
      raise ActiveRecord::RecordNotFound
    end

    redirect_to url_for(task.logs)
  end
end
