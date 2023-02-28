/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Folder } from '@athenna/common'
import { Config } from '@athenna/config'
import { ViewProvider } from '@athenna/view'
import { LoggerProvider } from '@athenna/logger'
import { Artisan, ArtisanProvider, ConsoleKernel } from '#src'

test.group('ConsoleKernelTest', group => {
  const artisan = Path.pwd('bin/artisan.ts')

  group.each.setup(async () => {
    process.env.IS_TS = 'true'

    await Config.loadAll(Path.stubs('config'))

    new ViewProvider().register()
    new LoggerProvider().register()
    new ArtisanProvider().register()
  })

  group.each.teardown(async () => {
    await Folder.safeRemove(Path.app())
  })

  test('should be able to register route files using console kernel', async ({ assert }) => {
    await new ConsoleKernel().registerRouteCommands('../../../bin/console.js')

    const { stdout } = await Artisan.callInChild('hello hello', artisan)

    assert.equal(stdout, 'hello\n' + "{ loadApp: false, stayAlive: false, environments: [ 'hello' ] }\n")
  })

  test('should be able to custom exception handler using console kernel', async ({ assert }) => {
    await new ConsoleKernel().registerExceptionHandler('#tests/Stubs/handlers/Handler')

    const { stderr } = await Artisan.callInChild('error', artisan)

    assert.isTrue(stderr.includes('error happened!'))
  })
})
