/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { parse } from 'path'
import { Exception } from '@secjs/utils'

export class AlreadyExistFileException extends Exception {
  public constructor(resource: string, path: string) {
    const content = `The ${resource} ({yellow} "${
      parse(path).name
    }") already exists. Try using another name.`

    super(content, 500, 'NULL')
  }
}
