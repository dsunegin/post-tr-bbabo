#!/bin/sh

npm run compile

# Start each 2 min at 15 second

pm2 delete post-tr-bbabo-en-de
CRON="15 */3 * * * *" pm2 start --name post-tr-bbabo-en-de build/src/index-en-de.js
pm2 save