/**
 * Constants utilized by the internal config module (src/config).
 * @license GPL-3.0
 * @copyright 2021 SnapIT Solutions
 */
import type {
  Config,
  DBConfig,
  OAuthConfig,
  ServerConfig,
} from './index.js';

// User-accessible environment variable for setting custom config.yml location
export const ENV_VAR = 'CONFIG';

// Default location
export const DEF_LOCATION = './config.yml';

// Default OAuthConfig object
export const DEFAULT_OAUTH: OAuthConfig = {
  clientId: '',
  clientSecret: '',
  scopes: ['user'],
};

// Default ServerConfig object
export const DEFAULT_SERVER: ServerConfig = {
  port: 0,
  domain: 'example.com',
  sessionKey: 'enter a random key here',
};

// Default DBConfig object
export const DEFAULT_DATABASE: DBConfig = {
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
};

// Default Config object
export const DEFAULT_CONFIG: Config = {
  logLevel: 'info',
  database: DEFAULT_DATABASE,
  oauth: DEFAULT_OAUTH,
  server: DEFAULT_SERVER,
};
