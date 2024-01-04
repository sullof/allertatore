#!/usr/bin/env bash

docker stop tru-sullo-co
docker rm tru-sullo-co

docker run -d \
  --name tru-sullo-co \
  -p 3210 \
  --restart unless-stopped \
  -v $PWD:/usr/src/app \
  -v /vol/log/tru-sullo-co_app:/var/log/tru-sullo-co_app \
  --link ed2-postgres:postgres \
  -e NODE_ENV=production \
  -e VIRTUAL_HOST=tru.sullo.co \
  -e LETSENCRYPT_HOST=tru.sullo.co \
  -e LETSENCRYPT_EMAIL=francesco@sullo.co \
  -w /usr/src/app node:16 npm run start
