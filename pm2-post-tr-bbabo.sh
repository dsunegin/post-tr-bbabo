#!/bin/sh

# Start each 2 min

pm2 delete post-edaru
CRON="*/2 * * * *" pm2 start npm --name post-tr-bbabo  -- run start
pm2 save