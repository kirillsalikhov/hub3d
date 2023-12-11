require "rest_client"

module Conversion
  CONVERSION_HOST = "http://manager:3000"
  SYNC_CHECK_INTERVAL = 1

  class Conversion::Client
    # TODO remove CONVERSION_HOST
    def initialize(base_path = CONVERSION_HOST)
      @base_path = base_path
    end

    def job_create_url = "#{@base_path}/jobs"
    def job_status_url(job_id) = "#{@base_path}/jobs/#{job_id}/status"
    def job_files_url(job_id) = "#{@base_path}/jobs/#{job_id}/files"
    def job_logs_url(job_id) = "#{@base_path}/jobs/#{job_id}/logs"
    def job_cancel_url(job_id) = "#{@base_path}/jobs/#{job_id}/cancel"
    def job_file_download_url(path) = "#{@base_path}/#{path}"

    def create_job(conversion_params)
      res = RestClient.post(job_create_url, conversion_params)
      JSON.parse(res)["id"]
    rescue RestClient::NotFound => e
      # RestClient on this url returns 404 when recipe doesn't exist
      # TODO ask change in CS for providing err, and status 422
      raise ConversionError.new("Wrong conversion params")
    end

    def cancel_job(job_id)
      res = RestClient.get(job_cancel_url(job_id))
      JSON.parse(res)
    end

    def check_status(job_id)
      res = RestClient.get(job_status_url(job_id))
      JSON.parse(res).with_indifferent_access
    end

    def wait_for_ready_sync(job_ids, timeout)
      jobs = job_ids.map { |id|
        {
          id: id,
          done: false,
          status: nil
        }
      }
      start = Time.now
      while (jobs.any? { |j| !j[:done] }) &&
          (Time.now - start < timeout)

        sleep SYNC_CHECK_INTERVAL

        jobs
          .select { |j| !j[:done] }
          .each { |j|
          status = check_status(j[:id])
          conversion_status = status["status"]

          if %w[finished warnings error].include?(conversion_status)
            j[:done] = true
            j[:status] = conversion_status
          end
        }
      end
      jobs
    end

    def get_files(job_id)
      res = RestClient.get(job_files_url(job_id), {params: {use_external_host: false}})
      JSON.parse(res)
    end

    def get_logs(job_id)
      # TODO this method is used to store to active store
      # better have to have to load to temfile
      res = RestClient.get(job_logs_url(job_id))
      JSON.parse(res)["logs"]
    end

    def download_file(src)
      tempfile = Tempfile.new("change_for_debugging")
      # TODO Likely RestClient loads file to memory
      File.open(tempfile, "wb") do |output|
        output.write RestClient.get(src)
      end

      tempfile
    end
  end
end
