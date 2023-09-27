/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@athenna/common'

export class RunningTaskException extends Exception {
  public constructor(title: string) {
    super({
      status: 500,
      code: 'E_RUNNING_TASK',
      message: `Task "${title}" with "running" status.`,
      help: `The task "${title}" has ran and returned a "running" status, this means that "task.fail" or "task.complete" method havent been called inside the task callback. A task must end with one of this two status to be completed and interpreted by Artisan.`
    })
  }
}
