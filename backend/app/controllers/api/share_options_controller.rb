class Api::ShareOptionsController < Api::ApplicationController
  def update
    render html: "update"
  end

  def auth_password
    render html: "auth_password"
  end
end
