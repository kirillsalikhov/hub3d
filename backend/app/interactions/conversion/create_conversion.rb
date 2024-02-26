class Conversion::CreateConversion < ActiveInteraction::Base
  object :input, class: "ActiveStorage::Blob"
  string :recipe

  object :on_success,
    class: "ActiveInteraction::Base", default: nil

  def execute
    choose_server
    create_conversion_job
    create_conversion_task
    report

    @conversion_task
  end

  private

  def choose_server
    @cs_server = Conversion::AvailableHostQuery.new
      .call(recipe, filename, byte_size)
    @cs_server_url = Conversion.get_server(@cs_server)[:base_url]
  end

  def create_conversion_job
    @conversion_job_id = Conversion::Client.new(@cs_server_url)
      .create_job(
        input: input.url(expires_in: 1.week),
        recipe: recipe
      )
  end

  def create_conversion_task
    @conversion_task = Store::ConversionTask.create!(
      conversion_job_id: @conversion_job_id,
      cs_server: @cs_server,
      on_success: on_success,
      start_time: Time.now
    )
  end

  def filename = input.filename.to_s
  def byte_size = input.byte_size

  def report
    Rails.logger.info "conversion create [job_id]: \t #{@conversion_job_id}"
    Rails.logger.info "conversion create [recipe]: \t #{recipe}"
    Rails.logger.info "conversion create [filename]: \t #{filename}"
    Rails.logger.info "conversion create [byte_size]: \t #{byte_size}"
  end
end
