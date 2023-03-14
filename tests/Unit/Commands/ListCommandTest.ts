/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Artisan } from '#src'
import { Test, TestContext } from '@athenna/test'
import { BaseCommandTest } from '#tests/Helpers/BaseCommandTest'

export default class ListCommandTest extends BaseCommandTest {
  @Test()
  public async shouldBeAbleToListOtherCommandsByAlias({ assert }: TestContext) {
    const { stdout } = await Artisan.callInChild('list make', this.artisan)

    assert.isTrue(stdout.includes('[ LISTING MAKE ]'))
    assert.isTrue(stdout.includes('make:command <name> Make a new command file.'))
  }
}
