/**
 * Call this file through NodeJS (ie `node ./app.js`)
 * to start this application.
 *
 * See CONTRIBUTIING.md Before contributing to this file.
 * @copyright 2021 SnapIT Solutions <https://snapit.solutions>
 * @license GPL-3.0
 */
import { getLogger } from './util/index.js';
import getConfig from './config/index.js';
import startServer from './server.js';

async function main() {
  const log = await getLogger('app');

  try {
    const config = await getConfig();
    await startServer(config);
  } catch (err) {
    log.error('Failed to start the app.');
    log.error(err);
  }
}

main();
