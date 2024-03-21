#!/usr/bin/env bash
cd "$(dirname "$0")"

USER="deployer"
HOST="31.172.83.73"
PROJECT="hub3d"
REMOTE_PATH="/home/$USER/$PROJECT"

# just to remove repetition
ssh_auth_params="-i id_rsa -o StrictHostKeyChecking=accept-new"

function create_ssh_key() {
  echo "${IDRSA}" > id_rsa
  chmod 600 id_rsa
}

function prepare_ci_env() {
  # no mistake one > truncates file
  echo "CI_REGISTRY=${CI_REGISTRY}" > ci.env
  echo "CI_BACKEND_TAG=${CI_BACKEND_TAG}">> ci.env
  scp ${ssh_auth_params} ci.env $USER@$HOST:$REMOTE_PATH/compose/
}

function prepare_folders() {
  ssh ${ssh_auth_params} -tt $USER@$HOST << EOF
  mkdir -p $REMOTE_PATH
  cd $REMOTE_PATH
  mkdir -p compose
  mkdir -p compose/dev
  mkdir -p bin
  exit
EOF
}

function copy_compose_files() {
  scp ${ssh_auth_params} ../compose/conversion-service.prod.yml ../compose/hub.yml \
      $USER@$HOST:$REMOTE_PATH/compose/

  scp ${ssh_auth_params} ../compose/dev/https.yml \
      $USER@$HOST:$REMOTE_PATH/compose/dev/

  scp ${ssh_auth_params} ../bin/main.sh \
      $USER@$HOST:$REMOTE_PATH/bin/
}

function restart_containers() {
  ssh ${ssh_auth_params} -tt $USER@$HOST << EOF
  cd $REMOTE_PATH

  set -a # automatically export all variables
  source compose/ci.env
  set +a

  bin/main.sh pull \
  && bin/main.sh down \
  && bin/main.sh --dev=s up -d

  exit
EOF
}

# TODO make container for CI and put it inside space registry
echo Installing apt deps
apt update -qq -y && apt install -y openssh-client

create_ssh_key
prepare_folders
prepare_ci_env
copy_compose_files
restart_containers

