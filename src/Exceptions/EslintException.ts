/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@secjs/utils'

export class EslintException extends Exception {
  public constructor(resource: string, fileName: string) {
    const content = `Failed to lint ${resource} ({yellow} "${fileName}"). Please check your eslint configurations.`

    super(content, 500, 'NULL')
  }
}
