#!/bin/bash

cd "$(dirname "$0")"

compose_files="-f ../compose/hub.yml"

docker-compose ${compose_files} -p hub pull

docker-compose ${compose_files} -p hub run -e RAILS_ENV=development backend rake db:setup

docker-compose ${compose_files} -p hub down
