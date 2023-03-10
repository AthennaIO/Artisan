/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Config } from '@athenna/config'
import { Folder } from '@athenna/common'
import { ViewProvider } from '@athenna/view'
import { LoggerProvider } from '@athenna/logger'
import { Artisan, ConsoleKernel, ArtisanProvider } from '#src'
import { AfterAll, BeforeEach, Test, TestContext } from '@athenna/test'

export default class ListCommandTest {
  private artisan = Path.pwd('bin/artisan.ts')

  @BeforeEach()
  public async beforeEach() {
    process.env.IS_TS = 'true'

    await Config.loadAll(Path.stubs('config'))

    new ViewProvider().register()
    new LoggerProvider().register()
    new ArtisanProvider().register()

    const kernel = new ConsoleKernel()

    await kernel.registerExceptionHandler()
    await kernel.registerCommands()
  }

  @AfterAll()
  public async afterAll() {
    await Folder.safeRemove(Path.app())
  }

  @Test()
  public async shouldBeAbleToListOtherCommandsByAlias({ assert }: TestContext) {
    const { stdout } = await Artisan.callInChild('list make', this.artisan)

    assert.isTrue(stdout.includes('[ LISTING MAKE ]'))
    assert.isTrue(stdout.includes('make:command <name> Make a new command file.'))
  }
}
