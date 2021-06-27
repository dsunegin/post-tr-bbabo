#!/bin/sh

npm run compile

# Start each 2 min

pm2 delete post-tr-bbabo
CRON="*/30 * * * *" pm2 start npm --name post-tr-bbabo  -- run start
pm2 save