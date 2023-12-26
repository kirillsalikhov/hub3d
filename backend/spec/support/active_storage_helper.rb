def fixture_io(file_path)
  {
    io: File.open(Rails.root.join("spec/fixtures/#{file_path}")),
    filename: File.basename(file_path)
  }
end

def fixture_blob(file_path)
  ActiveStorage::Blob.create_and_upload!(
    **fixture_io(file_path)
  )
end
