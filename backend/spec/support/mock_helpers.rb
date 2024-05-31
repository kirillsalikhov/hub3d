module MockHelpers

  # STUB CS create and conversion task
  def stub_cs
    stub_cs_client_create
    stub_schedule_cs_task
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
  def stub_schedule_cs_task
    allow(Resource::ConvertCreate).to receive(:new)
      .and_wrap_original do |method, *args|
      method.call(*args).tap do |obj|
        allow(obj).to receive(:schedule_task)
      end
    end
  end

end
