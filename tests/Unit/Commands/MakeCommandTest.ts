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
import { File, Folder } from '@athenna/common'
import { LoggerProvider } from '@athenna/logger'
import { ExitFaker } from '#tests/Helpers/ExitFaker'
import { Artisan, ConsoleKernel, ArtisanProvider } from '#src'
import { AfterEach, BeforeEach, Test, TestContext } from '@athenna/test'

export default class MakeCommandTest {
  private originalPJson = new File(Path.pwd('package.json')).getContentAsStringSync()

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

  @AfterEach()
  public async afterEach() {
    ExitFaker.release()

    await Folder.safeRemove(Path.app())

    await new File(Path.pwd('package.json')).setContent(this.originalPJson)
  }

  @Test()
  public async shouldBeAbleToCreateACommandFile({ assert }: TestContext) {
    await Artisan.call('make:command TestCommand')

    const path = Path.console('Commands/TestCommand.ts')

    assert.isTrue(await File.exists(path))
    assert.isTrue(ExitFaker.faker.calledOnceWith(0))

    const packageJson = await new File(Path.pwd('package.json'))
      .getContent()
      .then(content => JSON.parse(content.toString()))

    assert.containsSubset(Config.get('rc.commands'), ['#app/Console/Commands/TestCommand'])
    assert.containsSubset(packageJson.athenna.commands, ['#app/Console/Commands/TestCommand'])

    assert.containsSubset(Config.get('rc.commandsManifest'), {
      testCommand: '#app/Console/Commands/TestCommand',
    })
    assert.containsSubset(packageJson.athenna.commandsManifest, {
      testCommand: '#app/Console/Commands/TestCommand',
    })
  }

  @Test()
  public async shouldThrowAnExceptionWhenTheFileAlreadyExists({ assert }: TestContext) {
    await Artisan.call('make:command TestCommand')
    await Artisan.call('make:command TestCommand')

    assert.isTrue(ExitFaker.faker.calledWith(1))
  }
}
