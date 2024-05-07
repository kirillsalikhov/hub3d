#!/bin/bash

cd "$(dirname "$0")"

echo "Copy app/models from container to host"
./main.sh cp backend:/backend/app/models/ ../../backend/app/

echo "Copy db/migrate from container to host"
./main.sh cp backend:/backend/db/migrate ../../backend/db
./main.sh cp backend:/backend/db/schema.rb ../../backend/db/schema.rb

echo "Copy initializers"
./main.sh cp backend:/backend/config/initializers ../../backend/config/
