#!/bin/sh

#npm run compile

# Start each n min at 15 second

pm2 delete post-tr-bbabo-en-de
CRON="15 */6 * * * *" pm2 start --name post-tr-bbabo-en-de build/src/index-en-de.js
pm2 save