#!/bin/bash

usage="
Script usage:
  bin/dev.sh [--dev=DEV_LETTERS]

DEV_LETTERS:
  b - backend : backend
  f - frontend : frontend (through ruby vite inside rails)
Examples:
  // start certain containers in dev mode
  dev.sh --dev=b up // backend sidekiq
  dev.sh --dev=f up // frontend
  dev.sh --dev=bf up // backend sidekiq frontend
  ----
"

cd "$(dirname "$0")"

if [[ -z $@ ]]; then
    echo "$usage"
    exit
fi

ARGS=()
dev=''
for i in "$@"
do
    if [[ $i == "--dev="* ]]
    then
        dev="${i#*=}"
        shift
    else
        ARGS+=("$i")
    fi
done

if [[ -z $dev ]]; then
    echo "$usage"
    exit
fi

prod_compose="-f ../compose/hub.yml -f ../compose/conversion-service.prod.yml"

dev_compose=()
dev_services=()

for l in $(echo ${dev} | grep -o .)
do
    case $l in
        b)
            echo "DEV backend : backend"
            dev_compose+=" -f ../compose/dev/backend.yml"
            dev_services+=" backend sidekiq"
        ;;
        f)
            echo "DEV frontend : frontend from another rails container"
            dev_compose+=" -f ../compose/dev/frontend.yml"
            dev_services+=" frontend"
        ;;
        s)
            echo "MOD https : extra settings for certs and configs"
            dev_compose+=" -f ../compose/dev/https.yml"
        ;;
    esac
done

docker compose ${prod_compose} ${dev_compose} -p hub watch ${dev_services}
