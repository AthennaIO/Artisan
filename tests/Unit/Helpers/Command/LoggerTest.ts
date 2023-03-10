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
import { Artisan, ArtisanProvider, ConsoleKernel } from '#src'
import { AfterAll, BeforeEach, Test, TestContext } from '@athenna/test'

export default class LoggerTest {
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
  public async shouldBeAbleToExecuteAllArtisanLoggerMethods({ assert }: TestContext) {
    const { stdout } = await Artisan.callInChild('logger', this.artisan)

    assert.isTrue(stdout.includes('hello'))
    assert.isTrue(stdout.includes('hello updated'))
    assert.isTrue(
      stdout.includes(
        '  _          _ _       \n' +
          ' | |__   ___| | | ___  \n' +
          " | '_ \\ / _ \\ | |/ _ \\ \n" +
          ' | | | |  __/ | | (_) |\n' +
          ' |_| |_|\\___|_|_|\\___/ \n',
      ),
    )
  }
}
