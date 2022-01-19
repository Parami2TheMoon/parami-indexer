#!/bin/bash
rm -rf dist
yarn build
systemctl stop subql-indexer.service
systemctl stop subql-query.service
sudo -u postgres psql -f ./clean.sql
