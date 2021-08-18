/**
 * See CONTRIBUTIING.md Before contributing to this file.
 * @copyright 2021 SnapIT Solutions <https://snapit.solutions>
 * @license GPL-3.0
 */
import { v4 as uuid } from 'uuid';
import { DEFAULT_CONFIG, DEFAULT_OAUTH } from './constants.js';
import {
  prompt,
  promptNum,
} from '../util/index.js';
import {
  Config,
  DBConfig,
  ServerConfig,
  OAuthConfig,
} from './index.js';

// populateDb: Get all the credentials for the database.
async function populateDb(): Promise<DBConfig> {
  const host = await prompt('What is the IP address for the postgres db? ');
  const port = await promptNum('What is the port for the postgres db? ');
  const database = await prompt('What is the name of the database to use? ');
  const username = await prompt('What is the username? ');
  const password = await prompt(
    'What is the password? (masked)',
    true,
  );

  return {
    database,
    host,
    port,
    username,
    password,
  };
}

// populateSvr: Get all the details for the server.
async function populateSvr(): Promise<ServerConfig> {
  const domain = await prompt(
    'What is the domain we should use? (example.com) ',
  );
  const port = await promptNum(
    'What port should this server listen on? ',
  );
  const sessionKey = uuid();

  return {
    domain,
    port,
    sessionKey,
  };
}

// populateOAuth: Get all the details for the OAuth config.
async function populateOAuth(): Promise<OAuthConfig> {
  const clientId = await prompt("What's the OAuth2 client ID? ");
  const clientSecret = await prompt("What's the secret? ", true);

  return {
    clientId,
    clientSecret,
    scopes: DEFAULT_OAUTH.scopes,
  };
}

/**
 * Help the user fill out a new config file.
 * @returns {Promise<Config>}
 */
export default async function populate(): Promise<Config> {
  const database = await populateDb();
  const server = await populateSvr();
  const oauth = await populateOAuth();

  return {
    logLevel: DEFAULT_CONFIG.logLevel,
    database,
    server,
    oauth,
  };
}
