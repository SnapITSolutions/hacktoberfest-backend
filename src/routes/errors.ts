/**
 * These are all the common errors that all the routes share
 *
 * See CONTRIBUTIING.md before contributing to this file.
 * @copyright 2021 SnapIT Solutions <https://snapit.solutions/>
 * @license GPL-3.0
 */
import { ResError } from '../types.js';

const CODE_OFFSET = 100;
export const INTERNAL_ERROR: ResError = {
  code: CODE_OFFSET + 1,
  message: 'An internal error occurred',
}
