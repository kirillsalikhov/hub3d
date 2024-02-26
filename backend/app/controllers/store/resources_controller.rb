class Store::ResourcesController < ApplicationController
  # TODO remove, not needed
  include ActiveStorage::SetCurrent

  before_action :set_store_resource, only: %i[show edit update destroy]

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
