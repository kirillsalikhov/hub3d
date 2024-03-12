## Setup
1. Rename integration/compose/sample.env to .env and fill vars
2. Run integration/bin/setup_cs.sh
3. Run integration/bin/setup.sh

## Run

```
bin/main.sh up
```

## Dev

Use two consoles: one for docker compose up(main.sh), second for docker compose watch (dev.sh) with same --dev letters 

backend and frontend in dev mode

```
bin/main.sh --dev=bf up
bin/dev.sh --dev=bf
```
http://localhost:3050

frontend in dev mode
```
bin/main.sh --dev=f up
bin/dev.sh --dev=f
```
http://localhost:3050 (yes, same port)

## Update Open Api

```
bin/main.sh --dev=bf

# in other terminal
bin/openapi.sh
```

## Deploy
Optionally build and push new images
```
bin/main.sh build [backend|nginx] --push
```
### Prod 
```
deploy/prod.sh
```

### Staging
```
deploy/staging.sh
```
