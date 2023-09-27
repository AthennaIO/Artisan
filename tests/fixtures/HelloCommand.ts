/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Argument, BaseCommand } from '#src'
import { FixtureDatabase } from '#tests/fixtures/FixtureDatabase'

export class HelloCommand extends BaseCommand {
  @Argument({ signature: 'personName', description: 'The name of the person to greet' })
  public name: string

  public static signature() {
    return 'hello'
  }

  public async handle() {
    FixtureDatabase.set('hello:command', this.name)
  }
}

export const helloCommand = new HelloCommand()
