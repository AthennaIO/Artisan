/**
 * @athenna/logger
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { parse } from 'node:path'
import { Exception } from '@secjs/utils'

export class AlreadyExistFileException extends Exception {
  /**
   * Creates a new instance of AlreadyExistFileException.
   *
   * @param {string} resource
   * @param {string} path
   */
  constructor(resource, path) {
    const content = `The ${resource} ({yellow} "${
      parse(path).name
    }") already exists. Try using another name.`

    super(content, 500, 'E_SIMPLE_CLI')
  }
}
