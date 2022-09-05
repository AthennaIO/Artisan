/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Config, File, Folder, Path } from '@secjs/utils'

import { Artisan } from '#src/index'
import { Kernel } from '#tests/Stubs/app/Console/Kernel'
import { ArtisanProvider } from '#src/Providers/ArtisanProvider'
import { LoggerProvider } from '@athenna/logger/providers/LoggerProvider'

test.group('MakeServiceTest', group => {
  group.each.setup(async () => {
    await new Folder(Path.stubs('app')).copy(Path.app())
    await new Folder(Path.stubs('config')).copy(Path.config())

    await new Config().safeLoad(Path.config('app.js'))
    await new Config().safeLoad(Path.config('logging.js'))

    new LoggerProvider().register()
    new ArtisanProvider().register()

    const kernel = new Kernel()

    await kernel.registerErrorHandler()
    await kernel.registerCommands()
    await kernel.registerTemplates()
  })

  group.each.teardown(async () => {
    await Folder.safeRemove(Path.app())
    await Folder.safeRemove(Path.config())
  })

  test('should be able to create a service file', async ({ assert }) => {
    await Artisan.call('make:service TestService')

    const path = Path.services('TestService.js')

    assert.isTrue(await File.exists(path))
  }).timeout(60000)

  test('should throw an error when the file already exists', async ({ assert }) => {
    await Artisan.call('make:service TestService')
    await Artisan.call('make:service TestService')
  }).timeout(60000)
})
