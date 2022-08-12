#!/bin/bash
systemctl stop subql-indexer.service
systemctl stop subql-query.service
rm -rf dist
yarn codegen
yarn build
systemctl start subql-indexer.service
systemctl start subql-query.service
