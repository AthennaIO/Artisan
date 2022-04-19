/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Log } from '@athenna/logger'
import { Exception } from '@secjs/utils'

export class NodeExecException extends Exception {
  public constructor(command: string, stdout: string, stderr: string) {
    const content = `Error has occurred when executing the command "${command}"`

    super(content, 500, 'NODE_EXEC_ERROR')

    if (stdout) Log.error(stdout.replace('\n', ''))
    if (stderr) Log.error(stderr.replace('\n', ''))
  }
}
