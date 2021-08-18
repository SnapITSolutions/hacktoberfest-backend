#!/bin/bash
if [[ $PWD == *scripts ]]; then
  cd ../
fi

source ./scripts/internal/common.sh

if [[ $1 == *dev ]]; then
  DEV_SVR="True"
fi

# Check if the config exists, if not generate a new one
getConfig

command -v yarn &> /dev/null
if [[ $? -eq 0 ]]; then
  yarn
else
  npm i
fi

tsc
node ./dist/app.js
