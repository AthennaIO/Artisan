/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseCommand } from '#src'

export class LoadAppCommand extends BaseCommand {
  public static signature(): string {
    return 'loadapp'
  }

  public static description(): string {
    return 'Command with load app setting as true.'
  }

  public async handle(): Promise<void> {}
}
