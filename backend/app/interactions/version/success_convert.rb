class Version::SuccessConvert < ActiveInteraction::Base
  include SerializableInteraction

  string :version_id
  string :cs_server_url
  # TODO remove default
  string :conversion_job_id, default: nil
  boolean :set_current, default: true

  def execute
    download_files
    success_version_convert
    set_as_current
  end

  def download_files
    @files = Conversion::DownloadFilesConversion.run!(
      cs_server_url: cs_server_url,
      conversion_job_id: conversion_job_id
    )
  end

  def success_version_convert
    version.status = :ready
    version.files.attach(@files)
    version.save!
  end

  def set_as_current
    return unless set_current
    resource = version.resource
    resource.current = version
    resource.save!
  end

  private

  def version = @version ||= Store::Version.find(version_id)

end
