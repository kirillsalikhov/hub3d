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
