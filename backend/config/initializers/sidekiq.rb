sidekiq_config = { url: 'redis://redis:6379/0' }

Sidekiq.configure_server do |config|
  config.redis = sidekiq_config
  config.average_scheduled_poll_interval = 1
end

Sidekiq.configure_client do |config|
  config.redis = sidekiq_config
end
