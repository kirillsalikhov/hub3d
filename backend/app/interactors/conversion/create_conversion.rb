class Conversion::CreateConversion
  include Interactor

  def call
    create_conversion_job
    create_conversion_task

    # TODO add validation to ConversionTask, and handle errors
    @conversion_task.save!

    context.conversion_task = @conversion_task
  end

  private

  def create_conversion_job
    @conversion_job_id = Conversion::Client.new().create_job(
      input: context.input.url(expires_in: 1.week),
      recipe: context.recipe
    )
  end

  def create_conversion_task
    # TODO move default status and progress to inializer or whatever
    @conversion_task = Store::ConversionTask.new(
      conversion_job_id: @conversion_job_id,
      on_success: context.on_success,
      status: Store::ConversionTask::STATUSES[:in_progress],
      progress: 0,
      start_time: Time.now
    )
  end
end
