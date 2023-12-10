/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@athenna/common'

export class NotFoundLibraryException extends Exception {
  public constructor(library: string) {
    super({
      status: 500,
      code: 'E_SIMPLE_CLI',
      message: `The library ({dim,magenta} "${library}") cannot be found.`,
      help: `Remember that ({dim,magenta} "${library}") needs to be installed before running configurer command. Run ({dim,yellow} npm install ${library}) to install it.`
    })
  }
}
