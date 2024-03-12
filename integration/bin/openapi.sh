#!/bin/bash

cd "$(dirname "$0")"

echo "Generating swagger.yml"
./main.sh exec backend bash -c "SWAGGER_DRY_RUN=0 RAILS_ENV=test bundle exec rake rswag:specs:swaggerize"

echo "Coping from container"
./main.sh cp backend:/backend/swagger/v1/swagger.yaml ../../backend/swagger/v1/swagger.yaml

cd "../../backend/swagger-client"

echo "Generating client"
npm run generate-client
