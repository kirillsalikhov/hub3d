#!/bin/bash

function load_env() {
  source ./../compose/.env
}

function minio_setup() {
  # -net=host - needed for 127.0.0.1 to be host
  # default-bucket - our name
  docker run --net=host --entrypoint sh minio/mc -c "
    mc config host add minio http://127.0.0.1:10000 $HUB__MINIO_ROOT_USER $HUB__MINIO_ROOT_PASSWORD
    mc mb minio/default-bucket
    "
}
cd "$(dirname "$0")"

compose_files="-f ../compose/hub.yml"

docker compose ${compose_files} -p hub pull

# minio setup start
docker compose ${compose_files} -p hub up -d minio_for_backend
sleep 1
load_env
minio_setup
# minio end start


docker compose ${compose_files} -p hub run -e RAILS_ENV=development backend rake db:setup

docker compose ${compose_files} -p hub down
