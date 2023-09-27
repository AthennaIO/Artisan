/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseTest } from '#tests/helpers/BaseTest'
import { Test, type Context } from '@athenna/test'

export default class ListCommandTest extends BaseTest {
  @Test()
  public async shouldBeAbleToListArtisanCommandsByAlias({ command }: Context) {
    const output = await command.run('list make')

    output.assertSucceeded()
    output.assertLogged('[ LISTING MAKE ]')
    output.assertLogged('COMMAND')
    output.assertLogged('DESCRIPTION')
    output.assertLogged('make:command <name> Make a new command file.')
  }

  @Test()
  public async shouldLogEmptyWhenTheThereAreAnyCommandWithTheProvidedAlias({ command }: Context) {
    const output = await command.run('list not-found')

    output.assertSucceeded()
    output.assertLogged('[ LISTING NOT-FOUND ]')
    output.assertLogged('COMMAND')
    output.assertLogged('DESCRIPTION')
  }
}
