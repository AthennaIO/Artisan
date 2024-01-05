/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Option, BaseCommand } from '#src'
import { FixtureDatabase } from './FixtureDatabase.js'

export class GlobalAnnotatedCommand extends BaseCommand {
  @Option({ isFromGlobal: true, signature: '--env <env>' })
  public env: string

  public static signature() {
    return 'globalAnnotated'
  }

  public async handle() {
    FixtureDatabase.set('globalAnnotated:command', this.env)
  }
}

export const globalAnnotatedCommand = new GlobalAnnotatedCommand()
