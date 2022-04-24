/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@secjs/utils'

export class FacadeNotFoundException extends Exception {
  public constructor(facade: string) {
    const content = `Template facade ({yellow} "${facade}") has not been found.`

    super(content, 500, 'NULL')
  }
}
