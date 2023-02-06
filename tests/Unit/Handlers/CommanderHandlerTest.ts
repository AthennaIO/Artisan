/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Config } from '@athenna/config'
import { Folder } from '@athenna/common'
import { ViewProvider } from '@athenna/view'
import { LoggerProvider } from '@athenna/logger'
import { Artisan, ArtisanProvider, CommanderHandler, ConsoleKernel } from '#src'

test.group('CommanderHandlerTest', group => {
  const artisan = Path.pwd('bin/artisan.ts')

  group.each.setup(async () => {
    process.env.IS_TS = 'true'

    await Config.loadAll(Path.stubs('config'))

    new ViewProvider().register()
    new LoggerProvider().register()
    new ArtisanProvider().register()

    const kernel = new ConsoleKernel()

    await kernel.registerExceptionHandler()
    await kernel.registerCommands()
  })

  group.each.teardown(async () => {
    await Folder.safeRemove(Path.app())
  })

  test('should be able to get all the commands registered inside commander', async ({ assert }) => {
    const commands = CommanderHandler.getCommands()

    assert.deepEqual(commands, {
      'test [options] <requiredArg> [notRequiredArg]': 'The description of test command.',
      'make:command <name>': 'Make a new command file.',
      'list <alias>': 'List all commands available of the alias.',
      'template:customize': 'Export all the templates files of Athenna to the "resources/templates" path.',
    })
  })

  test('should be able to get all the commands registered inside commander by some alias', async ({ assert }) => {
    const commands = CommanderHandler.getCommands('make')

    assert.deepEqual(commands, {
      'make:command <name>': 'Make a new command file.',
    })
  })

  test('should be able to set the oficial Athenna version if none is used', async ({ assert }) => {
    Config.delete('app.version')

    const { stdout } = await Artisan.callInChild('--version', artisan)

    assert.isTrue(stdout.includes('Athenna Framework 3.0.0'))
  })
})
