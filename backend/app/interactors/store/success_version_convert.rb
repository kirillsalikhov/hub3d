class Store::SuccessVersionConvert
  include Interactor

  def call
    puts '---'
    puts 'SuccessVersionConvert !!! call'
    version = load_version

    # TODO add status
    # version.status = 'ready'

    # TODO check for context files
    version.files.attach(context.files)

    version.save!
    puts 'SuccessVersionConvert !!! end'
  end

  private

  def load_version
    # TODO check if not exist
    Store::Version.find(context.version_id)
  end

end
