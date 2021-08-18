<#
.SYNOPSIS
This is for dev.ps1 & prod.ps1 to utilize for generating the config.yml
#>

function GenDb {
  param (
    $RES
  )
  # Database questions
  $RES = $RES + "database:`n"
  Write-Host "Let's setup the database."

  ## Host
  $answer = Read-Host -Prompt "What's the IP address for the postgres database?"
  $RES = $RES + "  host: $answer`n"

  ## Port
  $answer = Read-Host -Prompt "What's the port?"
  $RES = $RES + "  port: $answer`n"

  ## Database
  $answer = Read-Host -Prompt "What's the name of the database to use?"
  $RES = $RES + "  database: $answer`n"

  ## Username
  $answer = Read-Host -Prompt "What's the username?"
  $RES = $RES + "  username: $answer`n"

  ## Password
  $answer = Read-Host -MaskInput -Prompt "What's the password?"
  $RES = $RES + "  password: $answer`n"

  return $RES
}


function GenServer {
  param (
    $RES
  )

  # Server Setup
  $RES = $RES + "server:`n"
  Write-Host "Now for server related questions."

  ## Domain
  $answer = Read-Host -Prompt "What domain will you be using (example.com)?"
  $RES = $RES + "  domain: $answer`n"

  ## Port
  $answer = Read-Host -Prompt "What port should the server listen on?"
  $RES = $RES + "  port: $answer`n"

  # Session key
  $sesKey = New-Guid
  $RES = $RES + "  sessionKey: $sesKey`n"

  return $RES
}

function GenOAuth {
  param (
    $RES
  )

  # OAuth Setup
  $RES = $RES + "oauth:`n"
  Write-Host "Now for some OAuth questions"

  ## ClientID
  $answer = Read-Host -Prompt "What is the client's ID?"
  $RES = $RES + "  clientId: $answer`n"

  ## Client Secret
  $answer = Read-Host -MaskInput -Prompt "What is the client's secret?"
  $RES = $RES + "  clientSecret: $answer`n"

  ## Scopes
  $RES = $RES + "  scopes: ['user']"

  return $RES
}

function GetConfig {
  $target = $PWD + "/config.yml"
  $envTarget = $CONFIG
  $exists = Test-Path $envTarget

  Write-Host "Loading configuration..."
  if (!$exists) {
    $exists = Test-Path $target

    if (!$exists) {
      GenConfig
    }
  }
  Write-Host "Configuration loaded."
}

function GenConfig {
  $RES = "logLevel: info`n"
 
  Clear-Host
  $RESWithDB = GenDb($RES)
  Clear-Host
  $RESWithSvr = GenServer($RESWithDB)
  Clear-Host
  $RESWithOAuth = GenOAuth($RESWithSvr)

  # Finally output
  Write-Host "Config complete."

  Set-Content -Path "$PWD/config.yml" -Value $RESWithOAuth
}
