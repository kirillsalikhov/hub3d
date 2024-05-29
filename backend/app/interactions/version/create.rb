class Version::Create < ActiveInteraction::Base
  record :resource, class: "Store::Resource"
  symbol :status
  record :from_version, class: "Store::Version", default: nil

  array :files, default: nil do
    object class: "ActiveStorage::Blob"
  end


  def execute
    # TODO versions assoc is wrong, should be contained_in
    # @type [Store::Version]
    @version = @resource.versions.new(
      status: status,
      from_version: from_version
    )
    @version.files.attach(files)
    @version.save!
    @version
  end

end
