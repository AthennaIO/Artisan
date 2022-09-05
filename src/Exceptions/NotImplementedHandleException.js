/**
 * @athenna/logger
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@secjs/utils'

export class NotImplementedHandleException extends Exception {
  /**
   * Creates a new instance of NotImplementedHandleException.
   *
   * @param {string} className
   */
  constructor(className) {
    const content = `The ({yellow} "handle") method has not been implemented in your ({yellow} "${className}")`

    super(content, 500, 'E_SIMPLE_CLI')
  }
}
