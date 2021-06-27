#!/bin/sh

#npm run compile

# Start each 2 min at 31 second

pm2 delete post-tr-bbabo-en-fr
CRON="31 2-59/6 * * * *" pm2 start --name post-tr-bbabo-en-fr build/src/index-en-fr.js
pm2 save