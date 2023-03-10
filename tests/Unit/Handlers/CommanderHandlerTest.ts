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
import { Artisan, ArtisanProvider, CommanderHandler, ConsoleKernel } from '#src'
import { AfterAll, BeforeEach, Test, TestContext } from '@athenna/test'

export default class CommanderHandlerTest {
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
  public async shouldBeAbleToGetAllTheCommandsRegisteredInsideCommander({ assert }: TestContext) {
    const commands = CommanderHandler.getCommands()

    assert.deepEqual(commands, {
      'configure <libraries>': 'Configure one or more libraries inside your application.',
      'test [options] <requiredArg> [notRequiredArg]': 'The description of test command.',
      'make:command <name>': 'Make a new command file.',
      'list <alias>': 'List all commands available of the alias.',
      'template:customize':
        'Export all the templates files registered in "rc.view.templates" to the "resources/templates" path.',
    })
  }

  @Test()
  public async shouldBeAbleToGetAllTheCommandsRegisteredInsideCommanderBySomeAlias({ assert }: TestContext) {
    const commands = CommanderHandler.getCommands('make')

    assert.deepEqual(commands, {
      'make:command <name>': 'Make a new command file.',
    })
  }

  @Test()
  public async shouldBeAbleToSetTheOficialAthennaVersionIfNoneIsUsed({ assert }: TestContext) {
    Config.delete('app.version')

    const { stdout } = await Artisan.callInChild('--version', this.artisan)

    assert.isTrue(stdout.includes('Athenna Framework 3.0.0'))
  }
}
