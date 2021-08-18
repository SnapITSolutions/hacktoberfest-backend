/**
 * See CONTRIBUTIING.md before contributing to this file.
 * @copyright 2021 SnapIT Solutions <https://snapit.solutions/>
 * @license GPL-3.0
 */
import { Response } from 'express';

// eslint-disable-next-line import/prefer-default-export
export function badReq(res: Response): void {
  res.status(400);
}
