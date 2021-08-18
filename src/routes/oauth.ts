/**
 * See CONTRIBUTIING.md before contributing to this file.
 * @copyright 2021 SnapIT Solutions <https://snapit.solutions/>
 * @license GPL-3.0
 */
import { Response } from 'express';
import { URL } from 'node:url';
import { badReq } from './util.js';
import { Request } from '../types.js';
import getConfig from '../config/index.js';
import { getLogger } from '../server.js';
import { getState, getToken, getUserData } from '../github/index.js';

/**
 * This will get the redirect URL to GitHub's OAuth login page.
 * @param {string} state
 * @returns {string} The URL to GitHub's OAuth login page.
 */
async function getRedirUrl(state: string): Promise<string> {
  const res = new URL('https://github.com/login/oauth/authorize');
  const config = await getConfig();
  const { oauth } = config;
  const scopes = oauth.scopes.join(' ');

  res.searchParams.set('client_id', oauth.clientId);
  res.searchParams.set('scope', scopes);
  res.searchParams.set('state', state);

  return res.toString();
}

/**
 * POST /oauth/logout
 * Logs-out the user by destroying their session.
 */
export async function logout(req: Request, res: Response): Promise<void> {
  const log = await getLogger('logout');

  req.session.destroy((err?: Error) => {
    log.error(`Failed to logout user ${req.sessionID}\n`, err);
  });
  res.status(200);
  res.end();
}

/**
 * GET /oauth/login
 * Redirect the user to GitHub's OAuth login page.
 */
export async function redirect(
  req: Request,
  res: Response,
): Promise<void> {
  const state = await getState(req);
  const redir = await getRedirUrl(state.key);

  res.redirect(redir);
  res.end();
}

/**
 * GET /oauth/callback?code=<string>
 * This handles the OAuth callback endpoint. GitHub will redirect
 * users to this endpoint after they've successfully logged-in with
 * a code.
 */
export async function callback(
  req: Request,
  res: Response,
): Promise<void> {
  const { code } = req.query;
  const { state } = req.session;

  // That means they jumped to this point before going to /oauth
  if (code === undefined || state === undefined) {
    badReq(res);
    return;
  }
  const log = await getLogger('oauth-callback');

  try {
    const token = await getToken(req, code, state.key);
    const userData = await getUserData(req, token);
    res.send(userData);
  } catch (err) {
    log.error(`${req.sessionID} ran into an error... Redirecting.`);
    log.error(err);
    res.redirect('/');
  }
  res.end();
}
