/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@athenna/common'

export class IdleTaskException extends Exception {
  public constructor(title: string) {
    super({
      status: 500,
      code: 'E_IDLE_TASK',
      message: `Task "${title}" with "idle" status.`,
      help: `The task "${title}" has runned and returned a "idle" status, this means that "task.fail" or "task.complete" method havent been called inside the task callback. A task must end with one of this two status to be completed and interpreted by Artisan.`,
    })
  }
}
