class Conversion::CreateConversion
  include Interactor

  def call
    choose_server
    create_conversion_job
    create_conversion_task

    # TODO add validation to ConversionTask, and handle errors
    @conversion_task.save!

    context.conversion_task = @conversion_task
  end

  private

  def choose_server
    filename, byte_size = context.input.values_at(:filename, :byte_size)
    @cs_server = Conversion::AvailableHostQuery.new
      .call(context.recipe, filename.to_s, byte_size)
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
    # TODO move default status and progress to inializer or whatever
    @conversion_task = Store::ConversionTask.new(
      conversion_job_id: @conversion_job_id,
      cs_server: @cs_server,
      on_success: context.on_success,
      status: Store::ConversionTask::STATUSES[:in_progress],
      progress: 0,
      start_time: Time.now
    )
  end
end
