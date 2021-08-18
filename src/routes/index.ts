/**
 * See CONTRIBUTIING.md before contributing to this file.
 * @copyright 2021 SnapIT Solutions <https://snapit.solutions/>
 * @license GPL-3.0
 */
import { Application } from 'express';
import * as oauth from './oauth.js';

/**
 * Add all the routes to the Express server
 * @param {Application} svr
 */
export default function addRoutes(svr: Application): void {
  svr.get('/oauth/whoami', oauth.whoAmI);
  svr.get('/oauth/login', oauth.redirect);
  svr.get('/oauth/callback', oauth.callback);
  svr.post('/oauth/logout', oauth.logout);
}
