/**
 * See CONTRIBUTING.md before contributing to this file
 * @copyright 2021 SnapIT Solutions <https://snapit.solutions/>
 * @license GPL-3.0
 */
import log4js from 'log4js';
import * as util from '../util/index.js';

/**
 * getLogger for all of the GitHub module.
 * @param {string} context Additional context. Like the function name.
 * @returns {Promise<log4js.Logger>}
 */
export function getLogger(
  context: string,
): Promise<log4js.Logger> {
  return util.getLogger(`github ${context}`);
}

export * from './users.js';
