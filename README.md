hacktoberfest-backend

## Requirements
 * [Postgres](https://www.postgresql.org/)
 * [NodeJS](https://nodejs.org/)
 * Optional:
   * [yarn](https://yarnpkg.com/)

## Launching the Server
There are different ways to launch this program, either the vanilla way with
building with TypeScript and launching with node or provided (shell) scripts in
the scripts directory.

### With Node
To launch with NodeJS run the following in your terminal inside the project
directory.

```sh
# Setup:
$ npm i # or just "yarn"
$ tsc

# Only run this if you want to run the program in dev
$ DEV_SVR=True

# Make sure you copy config.example.yml and save as config.yml and fill it out.
$ node ./dist/app.js
```

### With Scripts
To launch with the provided scripts run the following below. If you haven't
created your own config.yml it will walk you through the process.

```sh
# If you're using powershell use ./scripts/start.ps1
# If you want to launch it in dev add "--dev" to the end
$ ./scripts/start.sh
```

## Environment Variables
 * `DEV_SVR` - Launch the server in development mode. (ex. DEV_SVR=True)
 * `CONFIG` - Set the config.yml location (ex. CONFIG=/absolute/path.yml)
