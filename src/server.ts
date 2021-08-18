/**
 * See CONTRIBUTING.md before contributing to this file.
 * @copyright 2021 SnapIT Solutions <https://snapit.solutions/>
 * @license GPL-3.0
 */
import express from 'express';
import es from 'express-session';
import log4js from 'log4js';
import { v4 as uuid } from 'uuid';
import * as util from './util/index.js';
import getConfig, { Config } from './config/index.js';
import addRoutes from './routes/index.js';
import SessionStore from './sessions.js';

export const server = express();

export async function getLogger(
  context: string,
): Promise<log4js.Logger> {
  return util.getLogger(`server ${context}`);
}

/**
 * Start the express server application.
 * @param {Config | undefined} optConf Optional config.
 * @returns {Promise<void>} Nothing.
 */
export default async function start(optConf?: Config): Promise<void> {
  const config = optConf || await getConfig();
  const log = await getLogger('start');
  const svr = config.server;
  const store = new SessionStore();

  server.listen(svr.port, () => {
    log.info(`Server is listening on port ${svr.port}`);
  });

  // Add express sessions middleware.
  server.use(es({
    cookie: {
      maxAge: 86400000, // one day
    },
    secret: svr.sessionKey,
    genid: () => uuid(),
    store,
  }));

  addRoutes(server);
}
