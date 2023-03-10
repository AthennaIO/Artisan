/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import figlet from 'figlet'

import { fake } from 'sinon'
import { Config } from '@athenna/config'
import { Folder } from '@athenna/common'
import { ViewProvider } from '@athenna/view'
import { LoggerProvider } from '@athenna/logger'
import { ExitFaker } from '#tests/Helpers/ExitFaker'
import { Artisan, ArtisanProvider, ConsoleKernel } from '#src'
import { AfterAll, BeforeEach, Test, TestContext } from '@athenna/test'

export default class ArtisanTest {
  private artisan = Path.pwd('bin/artisan.ts')

  @BeforeEach()
  public async beforeEach() {
    ExitFaker.fake()
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
    ExitFaker.release()
    await Folder.safeRemove(Path.app())
  }

  @Test()
  public async shouldThrowAnErrorWhenTryingToExecuteACommandThatDoesNotExist({ assert }: TestContext) {
    const { stderr } = await Artisan.callInChild('not-found', this.artisan)

    assert.equal(stderr, "error: unknown command 'not-found'\n")
  }

  @Test()
  public async shouldBeAbleToLogTheApplicationNameInEntrypointCommands({ assert }: TestContext) {
    const { stdout } = await Artisan.callInChild('', this.artisan)

    const appNameFiglet = figlet.textSync('Artisan')

    assert.equal(stdout, appNameFiglet.concat('\n\n'))
  }

  @Test()
  public async shouldBeAbleToRegisterCommandsAsRoutes({ assert }: TestContext) {
    process.env.NODE_ENV = 'test'

    const { stdout } = await Artisan.callInChild('hello world', this.artisan)

    assert.equal(stdout, "world\n{ loadApp: false, stayAlive: false, environments: [ 'hello' ] }\n")

    process.env.NODE_ENV = undefined
  }

  @Test()
  public async shouldBeAbleToSetArgumentsAndOptionsUsingArgumentAndOptionDecorators({ assert }: TestContext) {
    const { stdout } = await Artisan.callInChild('test test --other', this.artisan)

    assert.equal(stdout, 'test notRequiredArg true notRequiredOption\n')
  }

  @Test()
  public async shouldBeAbleToLoadTheApplicationIfTheLoadAppOptionsIsTrue({ assert }: TestContext) {
    const fakeIgniteFire = fake()
    ioc.instance('Athenna/Core/Ignite', { fire: fakeIgniteFire })

    await Artisan.call('loadapp')

    assert.isTrue(fakeIgniteFire.calledWith(['worker', 'console']))
  }
}
