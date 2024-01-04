#!/usr/bin/env bash

docker stop allertatore
docker rm allertatore

source .env && docker run -d \
  --name allertatore \
  -p 3210 \
  --restart unless-stopped \
  -v $PWD:/usr/src/app \
  -v /vol/log/allertatore_app:/var/log/allertatore_app \
  -e NODE_ENV=production \
  -e VIRTUAL_HOST=$SERVER \
  -e LETSENCRYPT_HOST=$SERVER \
  -e LETSENCRYPT_EMAIL=$EMAIL \
  -w /usr/src/app node:20 npm run start
