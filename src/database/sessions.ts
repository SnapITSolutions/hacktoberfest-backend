/**
 * See CONTRIBUTIING.md Before contributing to this file.
 * @copyright 2021 SnapIT Solutions <https://snapit.solutions>
 * @license GPL-3.0
 */
import nano from 'nano';
import log4js from 'log4js';
import * as internal from './index.js';
import {
  CallbackError,
  Session,
  SessionData,
} from '../types.js';

// getDb for sessions database
async function getDb(): Promise<nano.DocumentScope<SessionData>> {
  return internal.getDb();
}

// getLogger for session functions
function getLogger(context: string): Promise<log4js.Logger> {
  return internal.getLogger(`sessions ${context}`);
}

/**
 * Update or insert a document in the database.
 * @param {string} id The session being updated/inserted.
 * @parma {SessionData} data The data being inserted or overwritten with
 * @returns {Promise<void>}
 */
export async function setSession(
  id: string,
  data: SessionData,
): Promise<void> {
  const db = await getDb();
  try {
    await db.insert(data, id);
  } catch (err) {
    const log = await getLogger('setSession');
    log.error(`${id} ran into an error.\n`, err);
    log.debug(`${id} ran into an error.\n`, data);
    throw err;
  }
}

export async function dropSession(id: string): Promise<void> {
  const data = await getSession(id);
  if (data !== null) {
    data._deleted = true;
    await setSession(id, data);
  }
}

/**
 * Get a stored session from the database.
 * @param {string} id
 * @returns {Promise<SessionData | null>}
 */
export async function getSession(
  id: string,
): Promise<SessionData | null> {
  try {
    const db = await getDb();
    const storedRes = await db.get(id);

    if (storedRes === null) {
      return null;
    }

    if (storedRes._deleted) {
      return null;
    }

    return {
      ...storedRes,
      _deleted: storedRes._deleted || false,
    };
  } catch (err) {
    const log = await getLogger('getSession');
    log.error(`failed to get ${id}.\n`, err);
    throw err;
  }
}
