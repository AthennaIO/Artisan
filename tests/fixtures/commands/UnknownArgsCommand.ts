/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseCommand } from '#src'
import type { Commander } from '#src/artisan/Commander'

export class UnknownArgsCommand extends BaseCommand {
  public static signature(): string {
    return 'unknown'
  }

  public static commander(commander: Commander) {
    return commander.allowUnknownOption()
  }

  public async handle(): Promise<void> {
    console.log(process.argv)
  }
}
