/**
 * See CONTRIBUTIING.md Before contributing to this file.
 * @copyright 2021 SnapIT Solutions <https://snapit.solutions>
 * @license GPL-3.0
 */
import fs from 'node:fs';
import yaml from 'js-yaml';
import populate from './populate.js';
import {
  ENV_VAR,
  DEF_LOCATION,
} from './constants.js';

// DBConfig: Database configuration
export type DBConfig = {
  // ex. example.com, localhost, 127.0.0.1
  host: string,
  port: number,
  username: string,
  password: string,
  database: string,
}

// OAuthConfig: GitHub OAuth Client configuration
// You can get these details in your developer application page on GitHub
export type OAuthConfig = {
  clientId: string,
  clientSecret: string,
  scopes: string[],
}

// ServerConfig: Configuration for this program to utilize while running
// express.js
export type ServerConfig = {
  domain: string,
  port: number,
  // For Sessions+Cookies setup.
  // This should be
  sessionKey: string,
}

/**
 * Used by the entire program
 */
export type Config = {
  // refer to npmjs.com/packages/log4js for all the possible levels
  logLevel: string,
  database: DBConfig,
  oauth: OAuthConfig,
  server: ServerConfig,
}

let config: Config | null = null;

/**
 * Retrieve the location of the user's configuration.
 * @returns {string} If the env var isn't present it will utilize a
 * neighboring config.yml in the CWD.
 */
function getLocation(): string {
  const env = process.env[ENV_VAR];

  return env !== undefined ? env : DEF_LOCATION;
}

async function genConfig(target: string): Promise<Config> {
  const populated = await populate();
  const serialized = yaml.dump(populated);

  fs.writeFileSync(target, serialized);

  return populated;
}

/**
 * Get the config.yml, this will generate a new one if it doesn't exist. If a
 * new one is generated then an error will be thrown to prevent the server from
 * launching.
 * @throws {Error} If a default configuration has generated.
 * @returns {Promise<Config>}
 */
export default async function getConfig(): Promise<Config> {
  if (config !== null) {
    return config;
  }

  const target = getLocation();

  if (!fs.existsSync(target)) {
    const generated = await genConfig(target);
    config = generated;
    return config;
  }

  const data = fs.readFileSync(target);
  const dataStr = data.toString();
  // TODO(dylan): validate that all properties are present when casted.
  const parsed = yaml.load(dataStr) as Config;
  config = parsed;

  return config;
}
