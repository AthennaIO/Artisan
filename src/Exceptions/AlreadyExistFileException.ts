/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@athenna/common'

export class AlreadyExistFileException extends Exception {
  public constructor(path: string) {
    super({
      status: 500,
      code: 'E_SIMPLE_CLI',
      message: `The file ({yellow} "${path}") already exists. Try using another name or delete the file.`,
    })
  }
}
