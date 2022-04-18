/**
 * @athenna/architect
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
  static async command(command: string): Promise<void> {
    await exec(command)
  }
}
