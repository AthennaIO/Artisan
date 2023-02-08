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
import { Artisan, ArtisanProvider, ConsoleKernel } from '#src'

test.group('LoggerTest', group => {
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

  test('should be able to execute all artisan logger methods', async ({ assert }) => {
    const { stdout } = await Artisan.callInChild('logger', artisan)

    assert.isTrue(stdout.includes('hello'))
    assert.isTrue(stdout.includes('hello updated'))
    assert.isTrue(
      stdout.includes(
        '  _          _ _       \n' +
          ' | |__   ___| | | ___  \n' +
          " | '_ \\ / _ \\ | |/ _ \\ \n" +
          ' | | | |  __/ | | (_) |\n' +
          ' |_| |_|\\___|_|_|\\___/ \n' +
          '                       ',
      ),
    )
    assert.isTrue(stdout.includes('[ HELLO ]'))
    assert.isTrue(stdout.includes('KEY   VALUE\n' + 'hello world'))
    assert.isTrue(
      stdout.includes(
        'CREATE: app/Services/Service.ts\n' +
          'SKIP:   app/Services/Service.ts (File already exists)\n' +
          'ERROR:  app/Services/Service.ts (Something went wrong)',
      ),
    )
  })
})
