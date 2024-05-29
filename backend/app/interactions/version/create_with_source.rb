class Version::CreateWithSource < ActiveInteraction::Base
  record :resource, class: "Store::Resource"
  symbol :status, default: :ready
  record :from_version, class: "Store::Version", default: nil

  array :source_files do
    object class: "ActiveStorage::Blob"
  end

  def execute
    # TODO transaction
    create_main_version
    create_source_version
    create_ref

    @main_version
  end

  private

  def create_main_version
    @main_version = Version::Create.run!(
      resource: @resource,
      status: status,
      from_version: from_version
    )
  end

  def create_source_version
    @source_version = Version::Create.run!(
      resource: @resource,
      status: :ready,
      files: source_files
    )
  end

  def create_ref
    # TODO use builders?
    Store::ConvertedFromRef.create!(
      src_version: @main_version,
      dest_version: @source_version
    )
  end
end
