#!/bin/sh

npm run compile

# Start each n min

pm2 delete post-vaillant
CRON="*/5 * * * *" pm2 start npm --name post-vaillant  -- run start
pm2 save