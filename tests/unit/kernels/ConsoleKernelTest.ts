/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ArtisanProvider, CommanderHandler, ConsoleKernel } from '#src'
import { Test, BeforeEach, AfterEach, type Context } from '@athenna/test'

export default class ConsoleKernelTest {
  @BeforeEach()
  public beforeEach() {
    new ArtisanProvider().register()
  }

  @AfterEach()
  public afterEach() {
    Config.clear()
    ioc.reconstruct()
    CommanderHandler.reconstruct()
    CommanderHandler.exceptionHandler = undefined
  }

  @Test()
  public async shouldBeAbleToRegisterCommandsUsingRelativeJSPath({ assert }: Context) {
    Config.set('rc.commands', {
      'template:customize': './src/commands/TemplateCustomizeCommand.js'
    })

    const kernel = new ConsoleKernel()

    await kernel.registerCommands()

    assert.isTrue(CommanderHandler.hasCommand('template:customize'))
  }

  @Test()
  public async shouldBeAbleToRegisterCommandsUsingRelativeTSPath({ assert }: Context) {
    Config.set('rc.commands', {
      'template:customize': './src/commands/TemplateCustomizeCommand.ts'
    })

    const kernel = new ConsoleKernel()

    await kernel.registerCommands()

    assert.isTrue(CommanderHandler.hasCommand('template:customize'))
  }

  @Test()
  public async shouldBeAbleToRegisterCommandsUsingFullJSPath({ assert }: Context) {
    Config.set('rc.commands', {
      'template:customize': Path.src('commands/TemplateCustomizeCommand.js')
    })

    const kernel = new ConsoleKernel()

    await kernel.registerCommands()

    assert.isTrue(CommanderHandler.hasCommand('template:customize'))
  }

  @Test()
  public async shouldBeAbleToRegisterCommandsUsingFullTSPath({ assert }: Context) {
    Config.set('rc.commands', {
      'template:customize': Path.src('commands/TemplateCustomizeCommand.ts')
    })

    const kernel = new ConsoleKernel()

    await kernel.registerCommands()

    assert.isTrue(CommanderHandler.hasCommand('template:customize'))
  }

  @Test()
  public async shouldBeAbleToRegisterCommandsUsingImportAliasPath({ assert }: Context) {
    Config.set('rc.commands', {
      'template:customize': '#src/commands/TemplateCustomizeCommand'
    })

    const kernel = new ConsoleKernel()

    await kernel.registerCommands()

    assert.isTrue(CommanderHandler.hasCommand('template:customize'))
  }

  @Test()
  public async shouldBeAbleToRegisterMultipleCommandsConcurrently({ assert }: Context) {
    Config.set('rc.commands', {
      'make:command': '#src/commands/MakeCommandCommand',
      'template:customize': '#src/commands/TemplateCustomizeCommand'
    })

    const kernel = new ConsoleKernel()

    await kernel.registerCommands()

    assert.isTrue(CommanderHandler.hasCommand('make:command'))
    assert.isTrue(CommanderHandler.hasCommand('template:customize'))
  }

  @Test()
  public async shouldRegisterAllCommandsWhenArgvIsTheCLIEntrypoint({ assert }: Context) {
    Config.set('rc.commands', {
      'make:command': '#src/commands/MakeCommandCommand',
      'template:customize': '#src/commands/TemplateCustomizeCommand'
    })

    const kernel = new ConsoleKernel()

    await kernel.registerCommands(['node', 'artisan'])

    assert.isTrue(CommanderHandler.hasCommand('make:command'))
    assert.isTrue(CommanderHandler.hasCommand('template:customize'))
  }

  @Test()
  public async shouldRegisterOnlyTheCommandExecutedInCLIPresentInTheArgv({ assert }: Context) {
    Config.set('rc.commands', {
      'make:command': '#src/commands/MakeCommandCommand',
      'template:customize': '#src/commands/TemplateCustomizeCommand'
    })

    const kernel = new ConsoleKernel()

    await kernel.registerCommands(['node', 'artisan', 'make:command'])

    assert.isTrue(CommanderHandler.hasCommand('make:command'))
    assert.isFalse(CommanderHandler.hasCommand('template:customize'))
  }

  @Test()
  public async shouldRegisterAllCommandsIfCommandNameInRcIsNotTheSameOfItsSignature({ assert }: Context) {
    Config.set('rc.commands', {
      makeCommand: {
        path: '#src/commands/MakeCommandCommand',
        loadAllCommands: true
      },
      'template:customize': '#src/commands/TemplateCustomizeCommand'
    })

    const kernel = new ConsoleKernel()

    await kernel.registerCommands(['node', 'artisan', 'make:command'])

    assert.isTrue(CommanderHandler.hasCommand('make:command'))
    assert.isTrue(CommanderHandler.hasCommand('template:customize'))
  }

  @Test()
  public async shouldRegisterAllCommandsIfCommandHasTheSettingLoadAllCommands({ assert }: Context) {
    Config.set('rc.commands', {
      'make:command': {
        path: '#src/commands/MakeCommandCommand',
        loadAllCommands: true
      },
      'template:customize': '#src/commands/TemplateCustomizeCommand'
    })

    const kernel = new ConsoleKernel()

    await kernel.registerCommands(['node', 'artisan', 'make:command'])

    assert.isTrue(CommanderHandler.hasCommand('make:command'))
    assert.isTrue(CommanderHandler.hasCommand('template:customize'))
  }

  @Test()
  public async shouldBeAbleToRegisterRouteCommandsWithRelativeTSFilePath({ assert }: Context) {
    const kernel = new ConsoleKernel()

    await kernel.registerRouteCommands(`./tests/fixtures/routes/console.ts?version=${Math.random()}`)

    assert.isTrue(CommanderHandler.hasCommand('test:one'))
    assert.isTrue(CommanderHandler.hasCommand('test:two'))
    assert.isTrue(CommanderHandler.hasCommand('test:three'))
  }

  @Test()
  public async shouldBeAbleToRegisterRouteCommandsWithRelativeJSFilePath({ assert }: Context) {
    const kernel = new ConsoleKernel()

    await kernel.registerRouteCommands(`./tests/fixtures/routes/console.js?version=${Math.random()}`)

    assert.isTrue(CommanderHandler.hasCommand('test:one'))
    assert.isTrue(CommanderHandler.hasCommand('test:two'))
    assert.isTrue(CommanderHandler.hasCommand('test:three'))
  }

  @Test()
  public async shouldBeAbleToRegisterRouteCommandsWithFullTSFilePath({ assert }: Context) {
    const kernel = new ConsoleKernel()

    await kernel.registerRouteCommands(Path.fixtures(`routes/console.ts?version=${Math.random()}`))

    assert.isTrue(CommanderHandler.hasCommand('test:one'))
    assert.isTrue(CommanderHandler.hasCommand('test:two'))
    assert.isTrue(CommanderHandler.hasCommand('test:three'))
  }

  @Test()
  public async shouldBeAbleToRegisterRouteCommandsWithFullJSFilePath({ assert }: Context) {
    const kernel = new ConsoleKernel()

    await kernel.registerRouteCommands(Path.fixtures(`routes/console.js?version=${Math.random()}`))

    assert.isTrue(CommanderHandler.hasCommand('test:one'))
    assert.isTrue(CommanderHandler.hasCommand('test:two'))
    assert.isTrue(CommanderHandler.hasCommand('test:three'))
  }

  @Test()
  public async shouldBeAbleToRegisterRouteCommandsWithImportAliasPath({ assert }: Context) {
    const kernel = new ConsoleKernel()

    await kernel.registerRouteCommands('#tests/fixtures/routes/console')

    assert.isTrue(CommanderHandler.hasCommand('test:one'))
    assert.isTrue(CommanderHandler.hasCommand('test:two'))
    assert.isTrue(CommanderHandler.hasCommand('test:three'))
  }

  @Test()
  public async shouldBeAbleToRegisterTheDefaultAthennaConsoleExceptionHandler({ assert }: Context) {
    const kernel = new ConsoleKernel()

    assert.isUndefined(CommanderHandler.exceptionHandler)

    await kernel.registerExceptionHandler()

    assert.isDefined(CommanderHandler.exceptionHandler)
  }

  @Test()
  public async shouldBeAbleToRegisterTheCustomConsoleExceptionHandlerRelativeTSPath({ assert }: Context) {
    const kernel = new ConsoleKernel()

    assert.isUndefined(CommanderHandler.exceptionHandler)

    await kernel.registerExceptionHandler('./tests/fixtures/CustomConsoleExceptionHandler.ts')

    assert.isDefined(CommanderHandler.exceptionHandler)
  }

  @Test()
  public async shouldBeAbleToRegisterTheCustomConsoleExceptionHandlerRelativeJSPath({ assert }: Context) {
    const kernel = new ConsoleKernel()

    assert.isUndefined(CommanderHandler.exceptionHandler)

    await kernel.registerExceptionHandler('./tests/fixtures/CustomConsoleExceptionHandler.js')

    assert.isDefined(CommanderHandler.exceptionHandler)
  }

  @Test()
  public async shouldBeAbleToRegisterTheCustomConsoleExceptionHandlerFullTSPath({ assert }: Context) {
    const kernel = new ConsoleKernel()

    assert.isUndefined(CommanderHandler.exceptionHandler)

    await kernel.registerExceptionHandler(Path.fixtures('CustomConsoleExceptionHandler.ts'))

    assert.isDefined(CommanderHandler.exceptionHandler)
  }

  @Test()
  public async shouldBeAbleToRegisterTheCustomConsoleExceptionHandlerFullJSPath({ assert }: Context) {
    const kernel = new ConsoleKernel()

    assert.isUndefined(CommanderHandler.exceptionHandler)

    await kernel.registerExceptionHandler(Path.fixtures('CustomConsoleExceptionHandler.js'))

    assert.isDefined(CommanderHandler.exceptionHandler)
  }

  @Test()
  public async shouldBeAbleToRegisterTheCustomConsoleExceptionHandlerImportAliasPath({ assert }: Context) {
    const kernel = new ConsoleKernel()

    assert.isUndefined(CommanderHandler.exceptionHandler)

    await kernel.registerExceptionHandler('#tests/fixtures/CustomConsoleExceptionHandler')

    assert.isDefined(CommanderHandler.exceptionHandler)
  }
}
