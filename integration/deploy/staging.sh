#!/usr/bin/env bash
cd "$(dirname "$0")"

USER="deployer"
HOST="31.172.83.73"
PROJECT="hub3d"
REMOTE_PATH="/home/$USER/$PROJECT"

# prepare folders
ssh -tt $USER@$HOST << EOF
mkdir -p $REMOTE_PATH
cd $REMOTE_PATH
mkdir -p compose
mkdir -p compose/dev
mkdir -p bin
exit
EOF

# coping compose and main.sh script
# !!! Copy .env manually to ./compose
scp ../compose/conversion-service.prod.yml ../compose/hub.yml \
    $USER@$HOST:$REMOTE_PATH/compose/

scp ../compose/dev/https.yml \
    $USER@$HOST:$REMOTE_PATH/compose/dev/

scp ../bin/main.sh \
    $USER@$HOST:$REMOTE_PATH/bin/

# !!! Copy setup manually to bin and delete after !!!
# TODO add --dev=s to support httsp
ssh -tt $USER@$HOST << EOF
cd $REMOTE_PATH
bin/main.sh pull \
&& bin/main.sh down \
&& bin/main.sh --dev=s up -d

exit
EOF
