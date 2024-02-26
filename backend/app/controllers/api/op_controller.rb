class Api::OpController < Api::ApplicationController
  def convert_anonym
    blob = ActiveStorage::Blob.find_signed(params[:input_file])
    user = current_or_guest_user
    begin
      task, resource = Conversion::ConvertAnonOp.run!(input: blob, user: user)
      render json: task, except: [:on_success, :on_failure]
    # TODO make more centralized, or may be move them to Conversion::ConvertAnonOp
    # TODO this is works not only on ConversionError
    rescue Conversion::ConversionError => e
      render status: 422, json: {errors: e.message}
    end
  end

  private

  def convert_params
    params.require(:input_file)
  end
end
