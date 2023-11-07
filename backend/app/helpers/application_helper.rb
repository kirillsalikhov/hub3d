module ApplicationHelper
  def body_classes
    %W[body-#{action_name} body-#{controller_name}-#{action_name}]
  end
end
