/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'reflect-metadata'

import { Config } from '@athenna/config'
import { ViewProvider } from '@athenna/view'
import { LoggerProvider } from '@athenna/logger'
import { ExitFaker } from '#tests/Helpers/ExitFaker'
import { ThrowCommand } from '#tests/Stubs/commands/ThrowCommand'
import { AfterAll, BeforeEach, Test, TestContext } from '@athenna/test'
import { ArtisanProvider, CommanderHandler, COMMANDS_SETTINGS, ConsoleKernel } from '#src'

export default class ConsoleKernelTest {
  @BeforeEach()
  public async beforeEach() {
    ExitFaker.fake()

    await Config.loadAll(Path.stubs('config'))

    COMMANDS_SETTINGS.clear()
    CommanderHandler.getCommander().commands = []

    new ViewProvider().register()
    new LoggerProvider().register()
    new ArtisanProvider().register()
  }

  @AfterAll()
  public async afterAll() {
    ExitFaker.release()
  }

  @Test()
  public async shouldBeAbleToRegisterCommandsUsingConsoleKernel({ assert }: TestContext) {
    await new ConsoleKernel().registerCommands()

    assert.isDefined(COMMANDS_SETTINGS.get('make:command'))
    assert.isDefined(CommanderHandler.getCommands()['make:command <name>'])
  }

  @Test()
  public async shouldBeAbleToRegisterCommandsByArgvUsingConsoleKernel({ assert }: TestContext) {
    await new ConsoleKernel().registerCommands(['node', 'artisan', 'make:command'])

    assert.equal(COMMANDS_SETTINGS.size, 1)
    assert.isDefined(COMMANDS_SETTINGS.get('make:command'))
    assert.isDefined(CommanderHandler.getCommands()['make:command <name>'])
  }

  @Test()
  public async shouldBeAbleToRegisterRouteFilesUsingConsoleKernel({ assert }: TestContext) {
    await new ConsoleKernel().registerRouteCommands('./bin/console.ts')

    assert.isDefined(CommanderHandler.getCommands()['hello <hello>'])
  }

  @Test()
  public async shouldBeAbleToRegisterRouteFilesWithImportAliasUsingConsoleKernel({ assert }: TestContext) {
    await new ConsoleKernel().registerRouteCommands('#tests/Stubs/routes/console')

    assert.isDefined(CommanderHandler.getCommands()['importalias'])
  }

  @Test()
  public async shouldBeAbleToSetCustomExceptionHandlerUsingConsoleKernel({ assert }: TestContext) {
    await new ConsoleKernel().registerExceptionHandler('#tests/Stubs/handlers/Handler')

    const exec = CommanderHandler.bindHandler(new ThrowCommand())

    await exec()

    assert.isTrue(ExitFaker.faker.calledWith(1))
  }
}
