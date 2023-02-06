/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Command } from '#src/Artisan/Command'

export class Test extends Command {
  public static signature(): string {
    return 'test'
  }

  public static description(): string {
    return 'The description of test command.'
  }

  public async handle(): Promise<void> {
    console.log('oi')
  }
}
