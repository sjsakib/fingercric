Provisioning a new site
=======================

## Required packages

* nginx
* nodejs
* Git

eg, on Ubuntu:

    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    sudo apt-get install -y nodejs

## Nginx virtual host config

* see nginx.template.conf
* replace DOMAIN and USERNAME

## Systemd service

* node-systemd.template.service
* replace DOMAIN and USERNAME

