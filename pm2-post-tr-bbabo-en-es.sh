#!/bin/sh

#npm run compile

# Start each 5 min at 45 second

pm2 delete post-tr-bbabo-en-es
CONFIG=".env.es" CRON="45 */3 * * * *" pm2 start --name post-tr-bbabo-en-es build/src/index-en-es.js
pm2 save