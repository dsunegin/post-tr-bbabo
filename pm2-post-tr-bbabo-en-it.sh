#!/bin/sh

#npm run compile

# Start each 5 min at 45 second

pm2 delete post-tr-bbabo-en-it
CONFIG=".env.it" CRON="45 */4 * * * *" pm2 start --name post-tr-bbabo-en-it build/src/index-en-it.js
pm2 save