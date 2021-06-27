#!/bin/sh

npm run compile

# every 1 min
pm2 delete post-tr-bbabo-en-pl
#CONFIG=".env.pl" CRON="30 */1 * * * *" node build/src/index-en-pl.js
CONFIG=".env.pl" CRON="30 */2 * * * *" pm2 start --name post-tr-bbabo-en-pl build/src/index-en-pl.js
pm2 save