/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseCommand, Option } from '#src'

export class PluginCommand extends BaseCommand {
  public static signature() {
    return 'plugin'
  }

  @Option({ signature: '--throw' })
  public throw: boolean

  public async handle() {
    if (this.throw) {
      throw new Error('This is a test error')
    }

    console.log('Hello stdout world!')
    console.error('Hello stderr world!')
  }
}
