/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@athenna/common'

export class NotFoundConfigurerException extends Exception {
  public constructor(path: string, library: string) {
    super({
      status: 500,
      code: 'E_SIMPLE_CLI',
      message: `The configurer file of ({magenta} "${library}") library cannot be found.`,
      help: `Remember that ({magenta} "${library}") needs to implement the Configurer class of Artisan and export it in ({yellow} "${path}").`
    })
  }
}
