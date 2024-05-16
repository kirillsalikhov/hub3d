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
**Also see** [Main README.md](../README.md) 

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

## Working with credentials

There's no master.key file and should not be 

Master key is passed through env, look inside .env file HUB__RAILS_MASTER_KEY or in docker compose files

### Edit credentials
```
RAILS_MASTER_KEY=FILL_ME EDITOR="code --wait" rails credentials:edit
```
### View credentials
```
RAILS_MASTER_KEY=FILL_ME EDITOR="code --wait" rails credentials:show
```
