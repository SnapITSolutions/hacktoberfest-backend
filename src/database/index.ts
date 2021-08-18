/**
 * See CONTRIBUTIING.md Before contributing to this file.
 * @copyright 2021 SnapIT Solutions <https://snapit.solutions>
 * @license GPL-3.0
 */
import nano from 'nano';
import log4js from 'log4js';
import * as util from '../util/index.js';
import getConfig from '../config/index.js';

let server: null | nano.ServerScope = null;

// getLogger for database module.
export async function getLogger(
  context: string,
): Promise<log4js.Logger> {
  return util.getLogger(`database ${context}`);
}

// getSvr to get a connection with the CouchDB server.
async function getSvr(): Promise<nano.ServerScope> {
  if (server !== null) {
    return server;
  }

  const config = await getConfig();
  const {
    username, password,
    host, port,
  } = config.database;

  // NOTE(dylhack): To partially enforce RFC7617 rules, hopefully this
  // will help prevent common mistakes when users configure the db
  // credentials.
  const encoded = encodeURI(`${username}:${password}`);
  server = nano(
    `http://${encoded}@${host}:${port}`,
  );

  // NOTE(dylhack): Test the connection.
  await server.info();
  return server;
}

// getDb for database module.
export async function getDb<T>(): Promise<nano.DocumentScope<T>> {
  const svr = await getSvr();
  return svr.use('hacktoberfest');
}

export * as sessions from './sessions.js';
