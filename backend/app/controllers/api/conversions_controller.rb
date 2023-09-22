class Api::ConversionsController < Api::ApplicationController
  def show
    task = Store::ConversionTask.find(params[:id])
    render json: task, except: [:on_success, :on_failure]
  end
end
