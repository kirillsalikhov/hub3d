# frozen_string_literal: true

require "rails_helper"

RSpec.configure do |config|
  # Specify a root folder where Swagger JSON files are generated
  # NOTE: If you're using the rswag-api to serve API descriptions, you'll need
  # to ensure that it's configured to serve Swagger from the same folder
  config.swagger_root = Rails.root.join("swagger").to_s

  # Define one or more Swagger documents and provide global metadata for each one
  # When you run the 'rswag:specs:swaggerize' rake task, the complete Swagger will
  # be generated at the provided relative path under swagger_root
  # By default, the operations defined in spec files are added to the first
  # document below. You can override this behavior by adding a swagger_doc tag to the
  # the root example_group in your specs, e.g. describe '...', swagger_doc: 'v2/swagger.json'
  config.swagger_docs = {
    "v1/swagger.yaml" => {
      openapi: "3.0.1",
      info: {
        title: "API V1",
        version: "v1"
      },
      paths: {},
      components: {
        schemas: {

          resource: {
            type: :object,
            properties: {
              id: {type: :string, format: :uuid},
              space_id: {type: :string, format: :uuid},
              space_key: {type: :string},
              name: {type: :string},
              current_id: {type: :string, format: :uuid, nullable: true},
              created_at: {type: :string, format: :date_time},
              updated_at: {type: :string, format: :date_time}
            },
            required: [:id, :space_id, :space_key, :name, :created_at, :updated_at]
          },

          share_options: {
            type: :object,
            properties: {
              space_id: {type: :string, format: :uuid},
              space_key: {type: :string},
              link_access: {type: :string},
              has_link_password: {type: :boolean}
            },
            required: [:link_access, :space_id, :space_key, :has_link_password]
          },

          resource_extended: {
            allOf: [
              {"$ref" => "#/components/schemas/resource"},
              {
                type: :object,
                properties: {
                  permissions: {
                    type: :object,
                    properties: {
                      manage: {type: :boolean},
                      share: {type: :boolean}
                    }
                  },
                  share_options: {"$ref" => "#/components/schemas/share_options"}
                }
              }
            ]
          },

          version: {
            type: :object,
            properties: {
              id: {type: :string, format: :uuid},
              space_id: {type: :string, format: :uuid},
              space_key: {type: :string},
              status: {"$ref" => "#/components/schemas/version_status"},
              resource_id: {type: :string, format: :uuid},
              is_version: {type: :boolean},
              created_at: {type: :string, format: :date_time},
              updated_at: {type: :string, format: :date_time}
            },
            required: [:id, :space_id, :space_key, :status, :resource_id, :is_version, :created_at, :updated_at]
          },

          asset_file: {
            type: :object,
            properties: {
              filename: {type: :string},
              size: {type: :integer},
              signedUrl: {type: :string},
              originFilePath: {type: :string}
            },
            required: [:filename, :size, :signedUrl, :originFilePath]
          },

          version_status: {
            type: :string,
            enum: %w[pending in_progress ready failed canceled]
          },

          conversion_status: {
            type: :string,
            enum: %w[finished inProgress failed canceled canceling]
          },

          conversion_task: {
            type: :object,
            properties: {
              id: {type: :string, format: :uuid},
              space_id: {type: :string, format: :uuid},
              space_key: {type: :string},
              status: {"$ref" => "#/components/schemas/conversion_status"},
              progress: {type: :number, minimum: 0, maximum: 1},
              start_time: {type: :string, format: :date_time, nullable: true},
              end_time: {type: :string, format: :date_time, nullable: true},
              conversion_job_id: {type: :string, nullable: true},
              created_at: {type: :string, format: :date_time},
              updated_at: {type: :string, format: :date_time},
              meta: {
                type: :object,
                properties: {
                  dest_resource_id: {type: :string, nullable: true},
                  dest_version_id: {type: :string, nullable: true}
                }
              }
            },
            required: [:id, :space_id, :space_key, :status, :progress, :conversion_job_id, :end_time, :created_at, :updated_at]
          }
        }
      },
      servers: [
        {
          url: "http://{defaultHost}",
          variables: {
            defaultHost: {
              default: "localhost:3050"
            }
          }
        }
      ]
    }
  }

  # Specify the format of the output Swagger file when running 'rswag:specs:swaggerize'.
  # The swagger_docs configuration option has the filename including format in
  # the key, this may want to be changed to avoid putting yaml in json files.
  # Defaults to json. Accepts ':json' and ':yaml'.
  config.swagger_format = :yaml
end
