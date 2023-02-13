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
import { Artisan, ConsoleKernel, ArtisanProvider } from '#src'

test.group('ListCommandTest', group => {
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

  test('should be able to list other commands by alias', async ({ assert }) => {
    const { stdout } = await Artisan.callInChild('list make', artisan)

    assert.equal(
      stdout,
      '[ LISTING MAKE ]\n' +
        '\n' +
        'COMMAND             DESCRIPTION             \n' +
        'make:command <name> Make a new command file.\n',
    )
  })
})
