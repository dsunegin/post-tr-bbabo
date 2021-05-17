#!/bin/sh

# Start each 1 min

pm2 delete post-edaru
CRON="* * * * *" pm2 start npm --name post-tr-bbabo  -- run start
pm2 save