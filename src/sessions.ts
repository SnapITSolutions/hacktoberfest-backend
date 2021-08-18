/**
 * Session storage, utilized by the express-session package.
 *
 * See CONTRIBUTING.md before contributing to this file.
 * @copyright 2021 SnapIT Solutions <https://snapit.solutions/>
 * @license GPL-3.0
 */
import { Store } from 'express-session';
import { CallbackRes, CallbackError, SessionData } from './types.js';
import { sessions } from './database/index.js';

export default class SessionStore extends Store {
  public destroy(sid: string, c: CallbackError): void {
    sessions.dropSession(sid)
      .then(() => c())
      .catch(c);
  }

  public get(sid: string, c: CallbackRes<SessionData>): void {
    sessions.getSession(sid)
      .then((ses) => c(null, ses))
      .catch((e) => c(e, null));
  }

  public set(sid: string, data: SessionData, c: CallbackError): void {
    sessions.setSession(sid, data)
      .then(() => c())
      .catch((err) => c(err));
  }
}
