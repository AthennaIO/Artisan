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

import { Artisan, TemplateHelper } from '#src/index'
import { Kernel } from '#tests/Stubs/app/Console/Kernel'
import { ArtisanProvider } from '#src/Providers/ArtisanProvider'
import { LoggerProvider } from '@athenna/logger/providers/LoggerProvider'

test.group('MakeCommandTest', group => {
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
  })

  test('should be able to create a command file', async ({ assert }) => {
    await Artisan.call('make:command TestCommands')

    const path = Path.console('Commands/TestCommands.js')

    assert.isTrue(await File.exists(path))
  }).timeout(60000)

  test('should throw an error when the file already exists', async ({ assert }) => {
    await Artisan.call('make:command TestCommand')
    await Artisan.call('make:command TestCommand')
  }).timeout(60000)

  test('should be able to replace template names and template values', async ({ assert }) => {
    TemplateHelper.addProperty('namePascal', 'Zap')

    await Artisan.call('make:command testCommands')

    const file = await new File(Path.console('Commands/testCommands.js')).load()

    assert.isTrue(file.fileExists)
    assert.isTrue(file.getContentSync().toString().includes('class Zap'))

    TemplateHelper.removeProperty('namePascal')
  }).timeout(60000)
})
