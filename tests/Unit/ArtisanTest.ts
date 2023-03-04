/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import figlet from 'figlet'

import { test } from '@japa/runner'
import { Config } from '@athenna/config'
import { Folder } from '@athenna/common'
import { ViewProvider } from '@athenna/view'
import { LoggerProvider } from '@athenna/logger'
import { ExitFaker } from '#tests/Helpers/ExitFaker'
import { Artisan, ArtisanProvider, ConsoleKernel } from '#src'

test.group('ArtisanTest', group => {
  const artisan = Path.pwd('bin/artisan.ts')

  group.each.setup(async () => {
    ExitFaker.fake()
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
    ExitFaker.release()
    await Folder.safeRemove(Path.app())
  })

  test('should throw an error when trying to execute a command that does not exist', async ({ assert }) => {
    const { stderr } = await Artisan.callInChild('not-found', artisan)

    assert.equal(stderr, "error: unknown command 'not-found'\n")
  })

  test('should be able to log the application name in entrypoint commands', async ({ assert }) => {
    const { stdout } = await Artisan.callInChild('', artisan)

    const appNameFiglet = figlet.textSync('Artisan')

    assert.equal(stdout, appNameFiglet.concat('\n\n'))
  })

  test('should be able to register commands as routes', async ({ assert }) => {
    process.env.NODE_ENV = 'test'

    const { stdout } = await Artisan.callInChild('hello world', artisan)

    assert.equal(stdout, "world\n{ loadApp: false, stayAlive: false, environments: [ 'hello' ] }\n")

    process.env.NODE_ENV = undefined
  })

  test('should be able to set arguments and options using Argument and Option decorators', async ({ assert }) => {
    const { stdout } = await Artisan.callInChild('test test --other', artisan)

    assert.equal(stdout, 'test notRequiredArg true notRequiredOption\n')
  })
})
