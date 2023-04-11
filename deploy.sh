#!/usr/bin/bash

# Build
cd /home/jack/repos/roboswarm-client
git pull
npm install --production=false --legacy-peer-deps
npm run build

# Move production bundle.
sudo su -c 'cd /var/www/app.roboswarm.dev && rm *.* && rm -rf assets/ && cp -R /home/jack/repos/roboswarm-client/dist/* /var/www/app.roboswarm.dev && chown -R www-data /var/www/app.roboswarm.dev'

# Clear the cache.
sudo su -c 'cd /var/cache/nginx && rm -rf *'