/**
 * These are all the types shared globally.
 *
 * See CONTRIBUTING.md before contributing to this file.
 * @copyright 2021 SnapIT Solutions <https://snapit.solutions/>
 * @license GPL-3.0
 */
import express from 'express';
import es from 'express-session';

// UserData: Data we collect on the user.
export type UserData = {
  name: string,
}

// State: State is utilized by GitHub's OAuth flow.
export type State = {
  // the actual code.
  key: string,
  // should always be 10 minutes from when it's generated.
  expires: Date,
}

// CallbackError: Used to define callback functions in a param
// that only invoke an error.
// eslint-disable-next-line no-unused-vars
export type CallbackError = (err?: Error) => void;

// CallbackRes: Used to define callback functions that return a
// possible result and error.
export type CallbackRes<T> = (
  // eslint-disable-next-line no-unused-vars
  err: Error | null,
  // eslint-disable-next-line no-unused-vars
  result: T | null | undefined,
) => void

export interface SessionData extends es.SessionData {
  // GitHub user OAuth token.
  token?: string,
  // Data we've collected from them.
  user?: UserData,
  // "state" is utilized by GitHub's OAuth-flow
  // to prevent MiTM attacks.
  state?: State,
  // CouchDB related data.
  _rev?: string,
  _id?: string,
  _deleted?: boolean,
}

// StoredSession: This is the output of the CouchDB query.
export interface StoredSessionData extends SessionData {
}

// Session: This is an example of what "could" a user's session
// data look like. Every property here should be possibly undefined.
export interface Session extends es.Session, SessionData { }

// Request: This is used for to extend Express's Request object and
// implement our own session data.
export interface Request<a = any, b = any, c = any, d = any>
  extends express.Request<a, b, c, d> {
  session: Session,
}
