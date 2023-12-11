class Store::ConversionJob
  include Sidekiq::Job

  sidekiq_options retry: false

  CHECK_INTERVAL = 1.second
  CHECK_TIMEOUT = 4.days

  STATUSES = Store::ConversionTask::STATUSES

  def perform(conversion_task_id)
    @task = Store::ConversionTask.find(conversion_task_id)

    begin
      check_status
    rescue Exception => e
      # TODO use logger
      print "Conversion Error: #{e.message}\n\tat #{e.backtrace.join("\n\tat ")}"
      failed
    ensure
      if @task.changed?
        @task.save!
        # TODO use serializer!
        ActionCable.server.broadcast(
          "tasks",
          {
            operation: :update,
            record: @task.as_json(except: [:on_success, :on_failure])
          }
        )
      end
    end
  end

  private

  def check_status
    status, progress = Conversion::Client.new()
      .check_status(@task.conversion_job_id)
      .values_at(:status, :progress)

    @task.progress = progress

    case status
    when "finished", "warnings"
      finished
    when "error"
      failed
    when "canceled"
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
    track_task_end(STATUSES[:finished])

    @task.on_success.context.conversion_job_id = @task.conversion_job_id
    @task.on_success.call

    save_logs
  end

  def canceled
    track_task_end(STATUSES[:canceled])
  end

  def failed
    track_task_end(STATUSES[:failed])
    save_logs
  end

  def is_timeout?
    Time.now - @task.start_time > CHECK_TIMEOUT
  end

  def track_task_end(status)
    @task.status = status
    @task.end_time = Time.now
  end

  def save_logs
    Conversion::SaveLogs.call(task: @task)
  end
end
