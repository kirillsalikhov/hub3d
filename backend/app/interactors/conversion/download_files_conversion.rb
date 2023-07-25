class Conversion::DownloadFilesConversion
  include Interactor

  def call
    context.files = get_files_list.map do |cs_file|
      # TODO check that originFilePath works
      ActiveStorage::Blob.create_and_upload!(
        io: download_tmp_file(cs_file['url']),
        filename: cs_file['name'],
        metadata: {
          origin_file_path: cs_file['name']
        }
      )
    end
  end

  private

  def get_files_list
    Conversion::Client.get_files(context.conversion_job_id)
  end

  def download_tmp_file(url)
    Conversion::Client.download_file(url)
  end
end
