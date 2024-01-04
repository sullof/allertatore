#!/usr/bin/env bash

source .env && docker run -it --rm \
  --name tru-sullo-co-dev \
  -p 3210 \
  -v $PWD:/usr/src/app \
  -v $PWD/log:/var/log/tru-sullo-co \
  -e NODE_ENV=development \
  -e VIRTUAL_HOST=tru.sullo.co.local \
  -w /usr/src/app node:16 npm run start-prod
