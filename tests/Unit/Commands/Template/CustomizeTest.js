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
import { File, Folder, Path } from '@athenna/common'

import { Artisan } from '#src/index'
import { Kernel } from '#tests/Stubs/app/Console/Kernel'
import { ArtisanProvider } from '#src/Providers/ArtisanProvider'
import { LoggerProvider } from '@athenna/logger/providers/LoggerProvider'

test.group('TemplateCustomizeTest', group => {
  group.each.setup(async () => {
    await new Folder(Path.stubs('app')).copy(Path.app())
    await new Folder(Path.stubs('config')).copy(Path.config())

    await Config.safeLoad(Path.config('app.js'))
    await Config.safeLoad(Path.config('logging.js'))

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
    await Folder.safeRemove(Path.resources())
  })

  test('should be able to customize all internal templates set in kernel', async ({ assert }) => {
    await Artisan.call('template:customize')

    const kernel = new Kernel()

    await kernel.registerTemplates()

    assert.isTrue(await File.exists(Path.resources('templates/command.ejs')))
  }).timeout(60000)

  test('should not re-move templates that are already inside resources/templates folder', async ({ assert }) => {
    const kernel = new Kernel()

    await Artisan.call('template:customize')

    await kernel.registerTemplates()

    await Artisan.call('template:customize')

    await kernel.registerTemplates()

    assert.isTrue(await File.exists(Path.resources('templates/command.ejs')))
  }).timeout(60000)
})
