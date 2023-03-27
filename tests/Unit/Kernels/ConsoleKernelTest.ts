/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'reflect-metadata'

import { CommanderHandler, ConsoleKernel } from '#src'
import { Test, ExitFaker, TestContext } from '@athenna/test'
import { BaseCommandTest } from '#tests/Helpers/BaseCommandTest'
import { ThrowCommand } from '#tests/Stubs/commands/ThrowCommand'

export default class ConsoleKernelTest extends BaseCommandTest {
  @Test()
  public async shouldBeAbleToRegisterCommandsUsingConsoleKernel({ assert }: TestContext) {
    CommanderHandler.getCommander<any>().commands = []

    await new ConsoleKernel().registerCommands()

    assert.isDefined(CommanderHandler.getCommands()['make:command <name>'])
  }

  @Test()
  public async shouldBeAbleToRegisterCommandsByArgvUsingConsoleKernel({ assert }: TestContext) {
    CommanderHandler.getCommander<any>().commands = []

    await new ConsoleKernel().registerCommands(['node', 'artisan', 'make:command'])

    assert.isDefined(CommanderHandler.getCommands()['make:command <name>'])
  }

  @Test()
  public async shouldBeAbleToRegisterRouteFilesUsingConsoleKernel({ assert }: TestContext) {
    CommanderHandler.getCommander<any>().commands = []

    await new ConsoleKernel().registerRouteCommands('./bin/console.ts')

    assert.deepEqual(Config.get('rc.commands.hello'), {
      loadApp: false,
      stayAlive: false,
      environments: ['hello'],
    })
    assert.isDefined(CommanderHandler.getCommands()['hello <hello>'])
  }

  @Test()
  public async shouldBeAbleToRegisterRouteFilesWithImportAliasUsingConsoleKernel({ assert }: TestContext) {
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
