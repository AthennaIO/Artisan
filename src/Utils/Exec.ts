/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { promisify } from 'util'
import { exec as ChildProcessExec } from 'child_process'

const exec = promisify(ChildProcessExec)

export class Exec {
  /**
   * Execute a command of child process exec as promise.
   *
   * @param command
   * @param ignoreErrors
   * @return void
   */
  static async command(command: string, ignoreErrors = false): Promise<void> {
    if (ignoreErrors) {
      try {
        await exec(command)
      } catch (error) {}

      return
    }

    await exec(command)
  }
}
