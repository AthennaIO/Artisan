/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Config } from '@athenna/config'
import { ViewProvider } from '@athenna/view'
import { Exec, Folder } from '@athenna/common'
import { LoggerProvider } from '@athenna/logger'
import { ArtisanProvider, ConsoleKernel } from '#src'
import { AfterAll, BeforeEach, Test, TestContext } from '@athenna/test'

export default class ConsoleExceptionHandlerTest {
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
  public async shouldBeAbleToLogThePrettyExceptionFromErrorInstances({ assert }: TestContext) {
    const { stderr } = await Exec.command(`npm run node ${Path.stubs('exceptionHandler.ts')} -- error`, {
      ignoreErrors: true,
    })

    assert.isTrue(stderr.includes('hello'))
    assert.isTrue(stderr.includes('ERROR'))
  }

  @Test()
  public async shouldBeAbleToLogThePrettyExceptionFromExceptionInstances({ assert }: TestContext) {
    const { stderr } = await Exec.command(`npm run node ${Path.stubs('exceptionHandler.ts')} -- exception`, {
      ignoreErrors: true,
    })

    assert.isTrue(stderr.includes('hello'))
    assert.isTrue(stderr.includes('world'))
    assert.isTrue(stderr.includes('HELP'))
    assert.isTrue(stderr.includes('EXCEPTION'))
  }

  @Test()
  public async shouldBeAbleToHideErrorsIfDebugModeIsNotActivated({ assert }: TestContext) {
    const { stderr } = await Exec.command(`npm run node ${Path.stubs('exceptionHandler.ts')} -- error --no-debug`, {
      ignoreErrors: true,
    })

    assert.isTrue(stderr.includes('ERROR'))
    assert.isTrue(stderr.includes('An\ninternal\nserver\nexception\nhas\noccurred.'))
  }
}
