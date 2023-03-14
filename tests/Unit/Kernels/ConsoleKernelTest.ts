/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'reflect-metadata'

import { Test, ExitFaker, TestContext } from '@athenna/test'
import { BaseCommandTest } from '#tests/Helpers/BaseCommandTest'
import { ThrowCommand } from '#tests/Stubs/commands/ThrowCommand'
import { CommanderHandler, COMMANDS_SETTINGS, ConsoleKernel } from '#src'

export default class ConsoleKernelTest extends BaseCommandTest {
  @Test()
  public async shouldBeAbleToRegisterCommandsUsingConsoleKernel({ assert }: TestContext) {
    COMMANDS_SETTINGS.clear()
    CommanderHandler.getCommander<any>().commands = []

    await new ConsoleKernel().registerCommands()

    assert.isDefined(COMMANDS_SETTINGS.get('make:command'))
    assert.isDefined(CommanderHandler.getCommands()['make:command <name>'])
  }

  @Test()
  public async shouldBeAbleToRegisterCommandsByArgvUsingConsoleKernel({ assert }: TestContext) {
    COMMANDS_SETTINGS.clear()
    CommanderHandler.getCommander<any>().commands = []

    await new ConsoleKernel().registerCommands(['node', 'artisan', 'make:command'])

    assert.equal(COMMANDS_SETTINGS.size, 1)
    assert.isDefined(COMMANDS_SETTINGS.get('make:command'))
    assert.isDefined(CommanderHandler.getCommands()['make:command <name>'])
  }

  @Test()
  public async shouldBeAbleToRegisterRouteFilesUsingConsoleKernel({ assert }: TestContext) {
    COMMANDS_SETTINGS.clear()
    CommanderHandler.getCommander<any>().commands = []

    await new ConsoleKernel().registerRouteCommands('./bin/console.ts')

    assert.isDefined(CommanderHandler.getCommands()['hello <hello>'])
  }

  @Test()
  public async shouldBeAbleToRegisterRouteFilesWithImportAliasUsingConsoleKernel({ assert }: TestContext) {
    COMMANDS_SETTINGS.clear()
    CommanderHandler.getCommander<any>().commands = []

    await new ConsoleKernel().registerRouteCommands('#tests/Stubs/routes/console')

    assert.isDefined(CommanderHandler.getCommands()['importalias'])
  }

  @Test()
  public async shouldBeAbleToSetCustomExceptionHandlerUsingConsoleKernel({ assert }: TestContext) {
    CommanderHandler.setExceptionHandler(null)

    await new ConsoleKernel().registerExceptionHandler('#tests/Stubs/handlers/Handler')

    const exec = CommanderHandler.bindHandler(new ThrowCommand())

    await exec()

    assert.isTrue(ExitFaker.faker.calledWith(1))
  }
}
