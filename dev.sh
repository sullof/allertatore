#!/usr/bin/env bash

source .env && docker run -it --rm \
  --name allertatore-dev \
  -p 3210 \
  -v $PWD:/usr/src/app \
  -v $PWD/log:/var/log/allertatore \
  -e NODE_ENV=development \
  -e VIRTUAL_HOST=$SERVER \
  -w /usr/src/app node:22 npm run start
