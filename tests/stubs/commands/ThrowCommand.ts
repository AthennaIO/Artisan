/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseCommand } from '#src'

export class ThrowCommand extends BaseCommand {
  public static signature(): string {
    return 'throw'
  }

  public static description(): string {
    return 'Throw some exception in handle.'
  }

  public async handle(): Promise<void> {
    throw new Error('hey')
  }
}
