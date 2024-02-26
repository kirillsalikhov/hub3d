class Conversion::DownloadFilesConversion < ActiveInteraction::Base
  string :conversion_job_id
  string :cs_server_url

  def execute
    get_files_list.map do |cs_file|
      # TODO check that originFilePath works
      ActiveStorage::Blob.create_and_upload!(
        io: download_tmp_file(cs_file["url"]),
        filename: cs_file["name"],
        metadata: {
          origin_file_path: cs_file["name"]
        }
      )
    end
  end

  def get_files_list
    client.get_files(conversion_job_id)
  end

  def download_tmp_file(url)
    client.download_file(url)
  end

  def client = @client ||= Conversion::Client.new(cs_server_url)
end
