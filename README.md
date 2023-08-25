## Setup
1. Rename integration/bin/sample.env to .env and fill vars
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

