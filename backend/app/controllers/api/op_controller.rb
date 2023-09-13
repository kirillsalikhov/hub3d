class Api::OpController < Api::ApplicationController

  def convert_anonym
    # TODO remove when not needed (input_signed_url exist only on kirill pc anyway)
    # input_signed_url = 'eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaWsxT0RNME1XTmxNUzFqT1RNNExUUTVOVEF0T0dKbU1TMHdaV0kyWWpNNVptTXhNbUVHT2daRlZBPT0iLCJleHAiOm51bGwsInB1ciI6ImJsb2JfaWQifX0=--3afe1c08b50091a022ca1e80c3779fa25150243c'
    # blob = ActiveStorage::Blob.find_signed(input_signed_url)
    blob = ActiveStorage::Blob.find_signed(params[:input_file])
    begin
      result = Conversion::ConvertAnonymOp.call(input: blob)
      render json: result.conversion_task, except: [:on_success, :on_failure]
    # TODO make more centralized, or may be move them to Conversion::ConvertAnonymOp
    rescue Conversion::ConversionError => e
      render status: 422, json: {errors: e.message}
    end
  end

  private

  def convert_params
    params.require(:input_file)
  end

end
