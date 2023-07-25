class Store::SuccessVersionConvertOrg
  include Interactor::Organizer

  organize Conversion::DownloadFilesConversion, Store::SuccessVersionConvert
end
