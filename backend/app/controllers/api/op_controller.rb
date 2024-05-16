class Api::OpController < Api::ApplicationController
  skip_before_action :set_tenant_from_header
  def convert_anonym
    blob = ActiveStorage::Blob.find_signed(params[:input_file])

    user = current_or_guest_user
    ensure_active_space(user)

    begin
      task, _resource = Conversion::ConvertAnonOp.run!(input: blob, user: user)
      render json: Store::ConversionTaskBlueprint.render(task)
    # TODO make more centralized, or may be move them to Conversion::ConvertAnonOp
    # TODO this is works not only on ConversionError
    rescue Conversion::ConversionError => e
      render status: 422, json: {errors: e.message}
    end
  end

  private

  def ensure_active_space(user)
    space = user.default_space || Space::CreateSpace.run!(user: user)
    set_current_tenant(space)
  end

  def convert_params
    params.require(:input_file)
  end
end
