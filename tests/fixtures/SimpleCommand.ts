/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseCommand } from '#src'
import { FixtureDatabase } from './FixtureDatabase.js'

export class SimpleCommand extends BaseCommand {
  public static signature() {
    return 'simple'
  }

  public async handle() {
    FixtureDatabase.set('simple:command', true)
  }
}

export const simpleCommand = new SimpleCommand()
