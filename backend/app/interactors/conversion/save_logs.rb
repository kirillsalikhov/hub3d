class Conversion::SaveLogs
  include Interactor

  def call
    task = context.task
    job_id = task.conversion_job_id
    # TODO do smth when there is no logs on CS
    logs = Conversion::Client.get_logs(job_id)
    task.logs.attach(
      io: StringIO.new(JSON.generate(logs)),
      filename: "#{job_id}_logs.json",
      content_type: "application/json"
    )
  end
end
