class Store::SuccessVersionConvert < ActiveInteraction::Base
  include SerializableInteraction

  string :version_id
  string :cs_server_url
  # TODO remove default
  string :conversion_job_id, default: nil

  def execute
    download_files
    success_version_convert
  end

  def download_files
    @files = Conversion::DownloadFilesConversion.run!(
      cs_server_url: cs_server_url,
      conversion_job_id: conversion_job_id
    )
  end

  def success_version_convert
    version = Store::Version.find(version_id)

    # TODO add status
    # version.status = 'ready'

    version.files.attach(@files)
    version.save!
  end

end
