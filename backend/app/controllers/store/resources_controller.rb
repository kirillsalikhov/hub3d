class Store::ResourcesController < ApplicationController
  # TODO remove, not needed
  include ActiveStorage::SetCurrent

  before_action :set_store_resource, only: %i[ show edit update destroy ]

  # GET /store/resources/new_convert
  def convert_new
    # TODO dummy, delete
    # Conversion::CreateConversion.call
  end

  # POST /store/resources/create_convert
  def convert_create
    pp(params)
    # TODO stop here, request from form goes here
  end

  def foobar
    #input_signed_url = 'eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaWswWVRRd09HRXhOQzAzTmpCbExUUXpOell0WWpObU9TMDFNMlpsTkdVMFpHSXhNV1VHT2daRlZBPT0iLCJleHAiOm51bGwsInB1ciI6ImJsb2JfaWQifX0=--7938bd443b092da13e85d0da808fa86dba73bc4c'
    input_signed_url = 'eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaWsxT0RNME1XTmxNUzFqT1RNNExUUTVOVEF0T0dKbU1TMHdaV0kyWWpNNVptTXhNbUVHT2daRlZBPT0iLCJleHAiOm51bGwsInB1ciI6ImJsb2JfaWQifX0=--3afe1c08b50091a022ca1e80c3779fa25150243c'
    blob = ActiveStorage::Blob.find_signed(input_signed_url)

    resource = Store::Resource.new()
    resource.save
    version = Store::Version.new()
    version.resource = resource
    version.save

    on_success = Store::SuccessVersionConvertOrg.new(version_id: version.id)
    result = Conversion::CreateConversion.call(
      input: blob,
      recipe: 'cad2wmd',
      on_success: on_success
    )

    Store::ConversionJob.perform_async(result.conversion_task.id)

    puts '--- conversion task ---'
    pp '! result: ', result.failure?
    # input
    # recepie
    # conversion_params


    render html: 'dummy output'
  end

  def testjob
    Store::ConversionJob.perform_async('test-arg')
    render html: 'check job'
  end

  # GET /store/resources
  def index
    @store_resources = Store::Resource.all
  end

  # GET /store/resources/1
  def show
  end

  # GET /store/resources/new
  def new
    @store_resource = Store::Resource.new
  end

  # GET /store/resources/1/edit
  def edit
  end

  # POST /store/resources
  def create
    @store_resource = Store::Resource.new(store_resource_params)

    if @store_resource.save
      redirect_to @store_resource, notice: "Resource was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /store/resources/1
  def update
    if @store_resource.update(store_resource_params)
      redirect_to @store_resource, notice: "Resource was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /store/resources/1
  def destroy
    @store_resource.destroy
    redirect_to store_resources_url, notice: "Resource was successfully destroyed."
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_store_resource
      @store_resource = Store::Resource.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def store_resource_params
      params.fetch(:store_resource).permit(:name)
    end
end
