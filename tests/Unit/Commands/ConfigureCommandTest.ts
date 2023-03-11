/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { fake } from 'sinon'
import { Config } from '@athenna/config'
import { ViewProvider } from '@athenna/view'
import { LoggerProvider } from '@athenna/logger'
import { Exec, File, Folder } from '@athenna/common'
import { ExitFaker } from '#tests/Helpers/ExitFaker'
import { Artisan, ConsoleKernel, ArtisanProvider } from '#src'
import { AfterEach, BeforeEach, Test, TestContext } from '@athenna/test'

export default class ConfigureCommandTest {
  private originalPJson = new File(Path.pwd('package.json')).getContentAsStringSync()

  @BeforeEach()
  public async beforeEach() {
    ExitFaker.fake()

    process.env.IS_TS = 'true'
    process.env.ARTISAN_TESTING = 'true'

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
    await Folder.safeRemove(Path.config())

    await File.safeRemove(Path.pwd('.env'))
    await File.safeRemove(Path.pwd('.env.test'))
    await File.safeRemove(Path.pwd('.env.example'))
    await File.safeRemove(Path.pwd('docker-compose.yml'))

    await new File(Path.pwd('package.json')).setContent(this.originalPJson)
  }

  @Test()
  public async shouldBeAbleToConfigurePathsInsideTheApplication({ assert }: TestContext) {
    await Artisan.call('configure ./tests/Stubs/library/build/Configurer/index.js')

    const { athenna } = await new File(Path.pwd('package.json')).getContentAsJson()

    assert.containsSubset(Config.get('rc.commands'), ['./tests/Stubs/library/build/Commands/MakeModelCommand.js'])
    assert.containsSubset(athenna.commands, ['./tests/Stubs/library/build/Commands/MakeModelCommand.js'])

    assert.containsSubset(Config.get('rc.providers'), ['./tests/Stubs/library/build/Providers/DatabaseProvider.js'])
    assert.containsSubset(athenna.providers, ['./tests/Stubs/library/build/Providers/DatabaseProvider.js'])

    assert.containsSubset(athenna.commandsManifest, {
      'make:model': './tests/Stubs/library/build/Commands/MakeModelCommand.js',
    })
    assert.containsSubset(Config.get('rc.commandsManifest'), {
      'make:model': './tests/Stubs/library/build/Commands/MakeModelCommand.js',
    })
  }

  @Test()
  public async shouldBeAbleToConfigureLibrariesInsideTheApplicationAndThrowErrorWhenConfigureDoesNotExist({
    assert,
  }: TestContext) {
    const originalCommand = Exec.command
    const commandFake = fake()

    Exec.command = (...args: any[]) => Promise.resolve(commandFake(...args))

    await Artisan.call('configure some-lib-name')

    Exec.command = originalCommand

    assert.isTrue(commandFake.calledOnceWith('npm install some-lib-name'))
    assert.isTrue(ExitFaker.faker.calledWith(1)) // <- Means that some error happened
  }
}
