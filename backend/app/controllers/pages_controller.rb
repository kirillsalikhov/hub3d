class PagesController < ApplicationController
  def root
    render inertia: 'Root', props: {
      uploadsPath: rails_direct_uploads_path
    }
  end

  def resource
    resource = Store::Resource.find(params[:id])
    # TODO  Should be current, not first
    version = resource.versions.with_attached_files.first

    # TODO should be in helper or whatever
    # should be refresh field, maybe checksum
    # originFilePath can be empty for source files
    files = version.files.map do |f|
      {
        signedUrl: f.url(expires_in: 1.hour),
        originFilePath: f.blob.metadata[:origin_file_path],
        filename: f.filename,
        size: f.byte_size,
      }
    end

    render inertia: 'Resource', props: {
      resource: resource,
      version: version,
      files: files
    }
  end
end
