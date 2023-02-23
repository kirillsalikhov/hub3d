#!/bin/bash

usage="
Script usage:
  scripts/main.sh [--dev=DEV_LETTERS] {up|down|stop|other docker-compose cmd}

DEV_LETTERS:
  b - backend : backend
  f - frontend : frontend (through ruby vite inside rails)
Examples:
  main.sh up // all container in prod mode

  // start certain containers in dev mode
  main.sh --dev=b up // backend
  ----
"

cd "$(dirname "$0")"

if [[ -z $@ ]]; then
    echo "$usage"
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

prod_compose="-f ../compose/hub.yml"

dev_compose=()

for l in $(echo ${dev} | grep -o .)
do
    case $l in
        b)
            echo "DEV backend : backend"
            dev_compose+=" -f ../compose/dev/backend.yml"
        ;;
        f)
            echo "DEV frontend : frontend from another rails container"
            dev_compose+=" -f ../compose/dev/frontend.yml"
        ;;
    esac
done

docker-compose ${prod_compose} ${dev_compose} -p hub "${ARGS[@]}"
