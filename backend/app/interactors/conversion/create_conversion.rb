class Conversion::CreateConversion
  include Interactor

  def call
    choose_server
    create_conversion_job
    create_conversion_task

    # TODO add validation to ConversionTask, and handle errors
    @conversion_task.save!

    context.conversion_task = @conversion_task

    report
  end

  private

  def filename = context.input.filename.to_s
  def byte_size = context.input.byte_size

  def choose_server
    @cs_server = Conversion::AvailableHostQuery.new
      .call(context.recipe, filename, byte_size)
    @cs_server_url = Conversion.get_server(@cs_server)[:base_url]
  end

  def create_conversion_job
    @conversion_job_id = Conversion::Client.new(@cs_server_url)
      .create_job(
        input: context.input.url(expires_in: 1.week),
        recipe: context.recipe
      )
  end

  def create_conversion_task
    @conversion_task = Store::ConversionTask.new(
      conversion_job_id: @conversion_job_id,
      cs_server: @cs_server,
      on_success: context.on_success,
      start_time: Time.now
    )
  end

  def report
    Rails.logger.info "conversion create [job_id]: \t #{@conversion_job_id}"
    Rails.logger.info "conversion create [recipe]: \t #{context.recipe}"
    Rails.logger.info "conversion create [filename]: \t #{filename}"
    Rails.logger.info "conversion create [byte_size]: \t #{byte_size}"
  end
end
