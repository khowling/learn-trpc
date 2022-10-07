#!/bin/bash
set -e

find . -name node_modules -type d -prune -exec rm -fr {} \;
find . -name dist -type d -prune -exec rm -fr {} \;

npm i
npm run build --workspace=server


npm run start --workspace=server
npm run start --workspace=ui