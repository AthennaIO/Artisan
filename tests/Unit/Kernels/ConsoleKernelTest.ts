/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Folder } from '@athenna/common'
import { Config } from '@athenna/config'
import { ViewProvider } from '@athenna/view'
import { LoggerProvider } from '@athenna/logger'
import { Artisan, ArtisanProvider, ConsoleKernel } from '#src'
import { AfterAll, BeforeEach, Test, TestContext } from '@athenna/test'

export default class ConsoleKernelTest {
  private artisan = Path.pwd('bin/artisan.ts')

  @BeforeEach()
  public async beforeEach() {
    process.env.IS_TS = 'true'

    await Config.loadAll(Path.stubs('config'))

    new ViewProvider().register()
    new LoggerProvider().register()
    new ArtisanProvider().register()
  }

  @AfterAll()
  public async afterAll() {
    await Folder.safeRemove(Path.app())
  }

  @Test()
  public async shouldBeAbleToRegisterRouteFilesUsingConsoleKernel({ assert }: TestContext) {
    await new ConsoleKernel().registerRouteCommands('../../../bin/console.js')

    const { stdout } = await Artisan.callInChild('hello hello', this.artisan)

    assert.equal(stdout, 'hello\n' + "{ loadApp: false, stayAlive: false, environments: [ 'hello' ] }\n")
  }

  @Test()
  public async shouldBeAbleToCustomExceptionHandlerUsingConsoleKernel({ assert }: TestContext) {
    await new ConsoleKernel().registerExceptionHandler('#tests/Stubs/handlers/Handler')

    const { stderr } = await Artisan.callInChild('error', this.artisan)

    assert.isTrue(stderr.includes('error happened!'))
  }
}
