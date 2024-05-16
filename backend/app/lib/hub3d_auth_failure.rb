# NOTE ! Don't forget restart rails server when making changes

class Hub3dAuthFailure < Devise::FailureApp
  def respond
    # these lines are copy pasted from Store, only api? branch needed
    if api?
      respond_401
    elsif http_auth?
      http_auth
    else
      redirect
    end
  end

  private

  def api?
    request.content_type == "application/json"
  end

  def respond_401
    self.status = 401
    self.content_type = "application/json"
    self.response_body = JSON.generate({errors: "not authenticated"})
  end
end
