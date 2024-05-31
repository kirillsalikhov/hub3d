module MockHelpers

  # STUB CS create and conversion task
  def stub_cs
    stub_cs_client_create
    stub_conversion_job
  end

  # STUB Conversion::Client.createJob, random uuid returned
  def stub_cs_client_create
    fake_client = instance_double(Conversion::Client)
    allow(fake_client).to receive(:create_job)
      .and_return(SecureRandom.uuid)

    allow(Conversion::Client).to receive(:new)
      .and_return(fake_client)
  end

  # Prevent schedule_task Store::ConversionTask
  # @deprecated
  def stub_schedule_cs_task
    allow(Resource::ConvertCreate).to receive(:new)
      .and_wrap_original do |method, *args|
      method.call(*args).tap do |obj|
        allow(obj).to receive(:schedule_task)
      end
    end
  end

  # Prevent sidekiq throw errors as it called with fake object
  def stub_conversion_job
    allow(Store::ConversionJob).to receive(:perform_async)
  end

end
