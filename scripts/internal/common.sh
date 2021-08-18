# This is utilized by dev.sh and prod.sh
result=""
target=""

pwdTarget="$PWD/config.yml"
envTarget=$CONFIG

if [ -f $envTarget ]; then
  target=$envTarget
else
  target=$pwdTarget
fi

function genDb() {
  local answer

  # Database questions
  echo "Let's setup the database."
  result+="database:\n"

  ## Host
  read -p "What's the IP address for the postgres database? " answer
  result+="  host: $answer\n"

  ## Port
  read -p "What's the port? " answer
  result+="  port: $answer\n"

  ## Database
  read -p "What's the name of the database to use? " answer
  result+="  database: $answer\n"

  ## Username
  read -p "What's the username? " answer
  result+="  username: $answer\n"

  ## Password
  read -s -p "What's the password? " answer
  result+="  password: $answer\n"
}

function genServer() {
  local answer

  # Server Setup
  echo "Now for server related questions."
  result+="server:\n"

  ## Domain
  read -p "What domain will you be using (example.com)? " answer
  result+="  domain: $answer\n"

  ## Port
  read -p "What port should the server listen on? " answer
  result+="  port: $answer\n"

  # Session key
  read -r uuidRes < /proc/sys/kernel/random/uuid
  result+="  sessionKey: $uuidRes\n"
}

function genOAuth() {
  local answer

  # OAuth Setup
  echo "Now for some OAuth questions"
  result+="oauth:\n"

  ## ClientID
  read -p "What is the client's ID? " answer
  result+="  clientId: $answer\n"

  ## Client Secret
  read -s -p "What is the client's secret? " answer
  result+="  clientSecret: $answer\n"

  ## Scopes
  result+="  scopes: ['user']"
}

function getConfig() {
  echo "Loading configuration.."
  if [ ! -f $target ]; then
    genConfig
  fi
  echo "Config loaded."
}

function genConfig() {
  result+="logLevel: info\n"
  
  clear
  genDb
  clear
  genServer
  clear
  genOAuth

  # Finally output
  echo "Config complete. Check $target"
  echo -e $result > $target
}
