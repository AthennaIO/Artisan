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
import { ViewProvider } from '@athenna/view'
import { Exec, Folder } from '@athenna/common'
import { LoggerProvider } from '@athenna/logger'
import { ArtisanProvider, ConsoleKernel } from '#src'

test.group('ConsoleExceptionHandlerTest', group => {
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

  test('should be able to log the pretty exception from Error instances', async ({ assert }) => {
    const { stderr } = await Exec.command(`ts-node --esm ${Path.stubs('exceptionHandler.ts')} error`, {
      ignoreErrors: true,
    })

    assert.isTrue(stderr.includes('MESSAGE\n   hello'))
  })

  test('should be able to log the pretty exception from Exception instances', async ({ assert }) => {
    const { stderr } = await Exec.command(`ts-node --esm ${Path.stubs('exceptionHandler.ts')} exception`, {
      ignoreErrors: true,
    })

    assert.isTrue(stderr.includes('MESSAGE\n   hello'))
    assert.isTrue(stderr.includes('HELP\n   hello'))
  })

  test('should be able to hide errors if debug mode is not activated', async ({ assert }) => {
    const { stderr } = await Exec.command(`ts-node --esm ${Path.stubs('exceptionHandler.ts')} error --no-debug`, {
      ignoreErrors: true,
    })

    assert.isTrue(stderr.includes('MESSAGE\n   An internal server exception has occurred.'))
  })
})
