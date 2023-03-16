require 'rest_client'

module Conversion

  CONVERSION_HOST = 'http://manager:3000'
  JOB_CREATE_URL = "#{CONVERSION_HOST}/jobs"
  JOB_STATUS_URL = -> (job_id) { "#{CONVERSION_HOST}/jobs/#{job_id}/status" }
  JOB_FILES_URL = -> (job_id) { "#{CONVERSION_HOST}/jobs/#{job_id}/files" }
  JOB_LOGS_URL = -> (job_id) { "#{CONVERSION_HOST}/jobs/#{job_id}/logs" }
  JOB_CANCEL_URL = -> (job_id) { "#{CONVERSION_HOST}/jobs/#{job_id}/cancel" }
  JOB_FILE_DOWNLOAD_URL = -> (path) {"#{CONVERSION_HOST}/#{path}" }

  SYNC_CHECK_INTERVAL = 1

  module Conversion::Client
    extend self

    def create_job(conversion_params)
      # TODO + error check
      res = RestClient.post(JOB_CREATE_URL, conversion_params)
      res_json = JSON.parse(res)
      res_json['id']
    end

    def cancel_job(job_id)
      res = RestClient.get( JOB_CANCEL_URL.call(job_id) )
      JSON.parse(res)
    end

    def check_status(job_id)
      res = RestClient.get( JOB_STATUS_URL.call(job_id))
      JSON.parse(res).with_indifferent_access
    end

    def wait_for_ready_sync(job_ids, timeout)
      jobs = job_ids.map{ |id|
        {
          id: id,
          done: false,
          status: nil
        }
      }
      start = Time.now
      while (jobs.any?{|j| !j[:done]}) &&
        (Time.now - start < timeout)

        sleep SYNC_CHECK_INTERVAL

        jobs
          .select{|j| !j[:done]}
          .each { |j|
          status = check_status(j[:id])
          conversion_status = status['status']

          if ['finished', 'warnings', 'error'].include?(conversion_status)
            j[:done] = true
            j[:status] = conversion_status
          end
        }
      end
      jobs
    end

    def get_files(job_id)
      res = RestClient.get( JOB_FILES_URL.call(job_id), {params: {use_external_host: false}})
      JSON.parse(res)
    end

    def get_logs(job_id)
      res = RestClient.get( JOB_LOGS_URL.call(job_id))
      JSON.parse(res)['logs']
    end

    def download_file(src, path)
      #TODO change to TemporaryFile
      dest = "/tmp/#{path}"
      FileUtils.mkdir_p(File.dirname(dest))
      File.open(dest, 'wb' ) do |output|
        output.write RestClient.get(src)
      end
      File.new(dest)
    end

  end
end
