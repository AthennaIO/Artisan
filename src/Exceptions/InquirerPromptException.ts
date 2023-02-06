/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@athenna/common'

export class InquirerPromptException extends Exception {
  public constructor(err: any) {
    super({
      status: 500,
      code: 'E_INQUIRER_PROMPT',
      message: `An error have occurred while trying to parse your question or read your answer.`,
      help: err,
    })
  }
}
