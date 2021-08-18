/**
 * See CONTRIBUTIING.md Before contributing to this file.
 * @copyright 2021 SnapIT Solutions <https://snapit.solutions>
 * @license GPL-3.0
 */
import nano from 'nano';
import log4js from 'log4js';
import * as internal from './index.js';
import { v4 as uuid } from 'uuid';
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
  await db.insert(data, id);
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
}
