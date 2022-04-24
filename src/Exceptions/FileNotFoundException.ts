/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@secjs/utils'

export class FileNotFoundException extends Exception {
  public constructor(file: string) {
    const content = `The file ({yellow} "${file}") has not been found.`

    super(content, 500, 'NULL')
  }
}
