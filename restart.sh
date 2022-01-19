#!/bin/bash
systemctl stop subql-indexer.service
systemctl stop subql-query.service
rm -rf dist
yarn codegen
yarn build
sudo -u postgres psql -f ./clean.sql
systemctl start subql-indexer.service
systemctl start subql-query.service
