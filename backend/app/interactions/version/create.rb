class Version::Create < ActiveInteraction::Base
  record :resource, class: "Store::Resource"
  boolean :is_version
  symbol :status
  record :from_version, class: "Store::Version", default: nil

  array :files, default: nil do
    object class: "ActiveStorage::Blob"
  end


  def execute
    # TODO versions assoc is wrong, should be contained_in
    # @type [Store::Version]
    @version = resource.asset_items.new(
      status: status,
      from_version: from_version
    )
    @version.versioned_resource = resource if is_version
    @version.files.attach(files) if files
    @version.save!
    @version
  end

end
