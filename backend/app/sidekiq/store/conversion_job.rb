class Store::ConversionJob
  include Sidekiq::Job

  # https://github.com/sidekiq/sidekiq/wiki/Error-Handling#automatic-job-retry
  # there are strange network problems between Conversion::Client and CS
  # 8 => 8 retries during 1h 22m 56s
  sidekiq_options retry: 8

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
      # TODO check error and retry counts, cs status and only then fail task
      failed
    ensure
      if @task.changed?
        @task.save!
        # TODO use serializer!
        ActionCable.server.broadcast(
          "task_#{@task.id}",
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
    status, progress = Conversion::Client.new(@task.cs_server_url)
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
        # TODO add info that timeout
        failed
      else
        _version_status(:in_progress)
        self.class.perform_in(CHECK_INTERVAL, @task.id)
      end
    end
  end

  def finished
    track_task_end(STATUSES[:finished])
    @task.on_success.conversion_job_id = @task.conversion_job_id
    @task.on_success.run!
    save_logs
  end

  def canceled
    track_task_end(STATUSES[:canceled])
    _version_status(:canceled)
  end

  def failed
    track_task_end(STATUSES[:failed])
    save_logs
    _version_status(:failed)
  end

  def is_timeout?
    Time.now - @task.start_time > CHECK_TIMEOUT
  end

  # TODO move to ConversionTask
  def track_task_end(status)
    @task.status = status
    @task.end_time = Time.now
  end

  # TODO should not be here
  # abstraction leak: conversionJob should not know about version
  def _version_status(status)
    return unless @task.meta.key?("dest_version_id")
    version = Store::Version.find(@task.meta["dest_version_id"])
    version.status = status
    version.save! if version.changed?
  end

  def save_logs
    Conversion::SaveLogs.run!(task: @task)
  end
end
