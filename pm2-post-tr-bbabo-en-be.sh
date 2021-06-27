#!/bin/sh

#npm run compile

pm2 delete post-tr-bbabo-en-be
CONFIG=".env.be" CRON="0 */3 * * * *" pm2 start --name post-tr-bbabo-en-be build/src/index-en-be.js
pm2 save