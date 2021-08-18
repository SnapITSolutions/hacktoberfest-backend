/**
 * Globally shared utility functions
 *
 * See CONTRIBUTING.md before contributing to this file.
 * @copyright 2021 SnapIT Solutions <https://snapit.solutions/>
 * @license GPL-3.0
 */
import log4js from 'log4js';
import getConfig from '../config/index.js';

/**
 * Get a log4js Logger instance. This function is utilized by modules
 * of this project. Each module will have their own getLogger to
 * further add context.
 * @param {string} context Additonal context, like a module name.
 * @returns {Promise<log4js.Logger}
 */
export async function getLogger(
  context: string,
): Promise<log4js.Logger> {
  const config = await getConfig();
  const log = log4js.getLogger(context);

  log.level = config.logLevel;
  return log;
}

// See src/util/prompt.ts
export {
  prompt,
  promptNum,
  promptBool,
} from './prompt.js';
