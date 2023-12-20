## Setup
1. Rename integration/compose/sample.env to .env and fill vars
2. Run integration/bin/setup_cs.sh
3. Run integration/bin/setup.sh

## Run

```
bin/main.sh up
```

## Dev

backend in dev mode

```
bin/main.sh --dev=b up
```
http://localhost:3050

frontend in dev mode
```
bin/main.sh --dev=f up
```
http://localhost:3050 (yes, same port)

### NOTE On npm install

#### 1. node_modules inside Container (recommended)

- Install package on host, it will update package-lock.json
- (a) Run npm ci in container:
    ```
    integration/bin/main.sh --dev=bf exec frontend npm ci
    ```
- (b) Build frontend container dev image
  ```
  integration/bin/main.sh --dev=bf build frontend
  ```
  restart containers (down step is needed to force recreate)
  ```
  integration/bin/main.sh --dev=bf down
  integration/bin/main.sh --dev=bf up  
  ```

#### 2. node_modules on Host
- Comment line ```- /backend/node_modules``` in integration/compose/dev/frontend.yml
- From time to time when doing ```npm ci``` also do ```sudo rm-rf node_modules```

## Testing
Backend:
```
// enter container
integration/bin/main --dev=bf exec backend bash
// run test inside container
RAILS_ENV=test rspec
```

## Open API

### UI
http://localhost:3050/api-docs/

login: developer

password: our dev password


### Generate OpenAPI specs

```
// up container before
// enter backend container
integration/bin/main --dev=bf exec backend bash
// generate specs
SWAGGER_DRY_RUN=0 RAILS_ENV=test rake rswag:specs:swaggerize
```

### Generate client

Inside backend/swagger-client

Once install dependencies for generator
```
npm ci
```

To generate/update api client
```
npm run generate-client
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
