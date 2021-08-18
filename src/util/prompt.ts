/**
 * This is a tiny prompt util to allow us merely to mask the input
 * from the user when entering sensitive data. It also supports
 * prompting for a valid number and a yes/no input.
 *
 * See CONTRIBUTING.md before contributing to this file.
 * @copyright 2021 SnapIT Solutions <https://snapit.solutions/>
 * @license GPL-3.0
 */
import readline from 'node:readline';
import stream from 'node:stream';
import { CallbackError } from '../types.js';

module maskable {
  const maskChar = Buffer.from('*');
  let masked = false;

  export function setMask(isMasked: boolean): void {
    masked = isMasked;
  }

  function write(
    buffer: Uint8Array | string,
    // NOTE(dylhack): ESLint isn't able to discover NodeJS @types/node
    // global scope definitions.
    // eslint-disable-next-line no-undef
    encoding: BufferEncoding = 'utf-8',
    callback: CallbackError,
  ) {
    try {
      if (masked) {
        process.stdout.write(
          maskChar,
          encoding,
        );
      } else {
        process.stdout.write(buffer, encoding);
      }
      callback();
    } catch (err) {
      callback(err);
    }
  }

  export const maskableOut = new stream.Writable({ write });

  export function getInterface(): readline.Interface {
    return readline.createInterface({
      input: process.stdin,
      output: maskableOut,
    });
  }
}

function promptInternal(
  rl: readline.Interface,
  dialogue: string,
  mask: boolean = false,
): Promise<string> {
  return new Promise((res) => {
    rl.question(dialogue, (ans: string) => {
      maskable.setMask(false);
      res(ans);
    });
    maskable.setMask(mask);
  });
}

/**
 * Prompt the user for string-related data.
 * @param {string} dialogue The dialogue to prompt them.
 * @param {boolean | undefined} mask Optionally mask their input.
 * @returns {Promise<string>} Their response wrapped in a promise.
 */
export async function prompt(
  dialogue: string,
  mask: boolean = false,
): Promise<string> {
  const rl = maskable.getInterface();

  try {
    const ans = await promptInternal(rl, dialogue, mask);

    return ans;
  } finally {
    rl.close();
  }
}

/**
 * Prompt the user a yes or no question.
 * @param {string} dialogue The dialogue to prompt them.
 * @param {boolean | undefined} mask Optionally mask their input.
 * @returns {Promise<boolean>} Their response wrapped in a promise.
 */
export async function promptBool(
  dialogue: string,
  mask: boolean = false,
): Promise<boolean> {
  const rl = maskable.getInterface();
  let res: boolean | null = null;

  try {
    do {
      // NOTE(dylhack): we can await this because this is utilized by
      // src/config/populate. This generates the configuration file for
      // this application to work so there is no reason to introduce
      // concurrency here, but I really don't want to be in callback
      // hell.
      // eslint-disable-next-line no-await-in-loop
      const resStr = await promptInternal(rl, dialogue, mask);
      const resStrLwr = resStr.toLowerCase();

      if (resStrLwr.includes('y')) {
        res = true;
      } else if (resStrLwr.includes('n')) {
        res = false;
      } else {
        rl.write('Please provide (y)es or (n)o\n');
      }
    } while (res === null);
  } finally {
    rl.close();
  }

  return res;
}

/**
 * Prompt the user for a number.
 * @param {string} dialogue The dialogue to prompt them.
 * @param {boolean | undefined} mask Optionally mask their input.
 * @returns {Promise<number>} Their response wrapped in a promise.
 */
export async function promptNum(
  dialogue: string,
  mask: boolean = false,
): Promise<number> {
  const rl = maskable.getInterface();
  let res;

  try {
    do {
      // NOTE(dylhack): read previous note why I'm doing this.
      // eslint-disable-next-line no-await-in-loop
      const resStr = await promptInternal(rl, dialogue, mask);
      res = Number(resStr);

      if (Number.isNaN(res) || resStr.length === 0) {
        rl.write(
          "That's not a number. Please enter a proper number.\n",
        );
      }
    } while (Number.isNaN(res));

    return res;
  } finally {
    rl.close();
  }
}
