#!/bin/sh

npm run compile

pm2 delete post-tr-bbabo-en-bg
CONFIG=".env.bg" CRON="55 */4 * * * *" pm2 start --name post-tr-bbabo-en-bg build/src/index-en-bg.js
pm2 save