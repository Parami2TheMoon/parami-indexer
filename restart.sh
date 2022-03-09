#!/bin/bash
systemctl stop subql-indexer.service
systemctl stop subql-query.service
rm -rf dist
yarn codegen
yarn build
chown -R www-data:www-data /var/www/parami-scanner
sudo -u postgres psql -f ./clean.sql
systemctl start subql-indexer.service
systemctl start subql-query.service
