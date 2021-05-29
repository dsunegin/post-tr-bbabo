#!/bin/sh

npm run compile

# Start each n min

pm2 delete post-vaillant
CRON="*/5 * * * *" pm2 start --name post-vaillant  build/src/index-vaillant.js
pm2 save