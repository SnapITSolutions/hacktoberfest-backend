if ($PWD.Path.EndsWith("scripts")) {
  cd ../
}

import-module -name ./scripts/internal/common.ps1

if ($args[0] -ne $null -and $args[0].EndsWith("dev")) {
  $DEV_SVR = "True"
}

try {
  yarn
} catch {
  npm i
} finally {
  GetConfig
  tsc
  node ./dist/app.js
}
