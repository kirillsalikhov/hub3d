class Store::ConversionJob
  include Sidekiq::Job

  CHECK_INTERVAL = 1.second
  CHECK_TIMEOUT = 4.days

  def perform(conversion_task_id)
    @task = Store::ConversionTask.find(conversion_task_id)

    begin
      check_status
    rescue Exception => e
      # TODO use logger
      print "Conversion Error: #{e.message}\n\tat #{e.backtrace.join("\n\tat ")}"
      failed
    end
  end

  private

  def check_status
    puts '-- @task -- '
    status, progress = Conversion::Client
                         .check_status(@task.conversion_job_id)
                         .values_at(:status, :progress)

    puts '--- progress ---'
    puts progress, status
    track_progress(progress)
    puts '--- progress ---'

    case status
    when 'finished', 'warnings'
      finished
    when 'error'
      failed
    when 'canceled'
      canceled
    else
      if is_timeout?
        failed
      else
        self.class.perform_in(CHECK_INTERVAL, @task.id)
      end
    end
  end

  def finished
    track_task_end

    @task.on_success.context.conversion_job_id = @task.conversion_job_id
    @task.on_success.call()
  end

  def canceled
    track_task_end
    # TODO do cancel
    raise NoMethodError
  end

  def failed
    track_task_end
    # TODO do fail
    raise NoMethodError
  end

  def is_timeout?
    Time.now - @task.start_time > CHECK_TIMEOUT
  end

  def track_progress(progress)
    return if progress.nil?
    return if @task.progress == progress

    @task.update!({progress: progress})
  end

  def track_task_end
    @task.update!({end_time: Time.now})
  end

end
