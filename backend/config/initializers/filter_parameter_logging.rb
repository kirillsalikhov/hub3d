# Be sure to restart your server when you modify this file.

# Configure parameters to be filtered from the log file. Use this to limit dissemination of
# sensitive information. See the ActiveSupport::ParameterFilter documentation for supported
# notations and behaviors.
Rails.application.config.filter_parameters += [
  :passw, :secret, :token, :crypt, :salt, :certificate, :otp, :ssn,
  # just not to have [FILTERED] for space_key, old was just :_key, that used to match all having _key
  /^(?!space_key)\w*_key/
]
