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

import { Artisan, TemplateHelper } from '#src/index'
import { Kernel } from '#tests/Stubs/app/Console/Kernel'
import { ArtisanProvider } from '#src/Providers/ArtisanProvider'
import { LoggerProvider } from '@athenna/logger/providers/LoggerProvider'

test.group('MakeCommandTest', group => {
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
  })

  group.each.teardown(async () => {
    await Folder.safeRemove(Path.app())
    await Folder.safeRemove(Path.config())
  })

  test('should be able to create a command file', async ({ assert }) => {
    await Artisan.call('make:command TestCommands --no-register')

    const path = Path.console('Commands/TestCommand.js')

    assert.isTrue(await File.exists(path))
  }).timeout(60000)

  test('should be able to create a command file and register it inside Kernel', async ({ assert }) => {
    const oldKernelLength = new File(Path.console('Kernel.js')).getContentSync().toString().length

    await Artisan.call('make:command KernelCommand')

    const newKernelLength = new File(Path.console('Kernel.js')).getContentSync().toString().length

    assert.notEqual(newKernelLength, oldKernelLength)
  }).timeout(60000)

  test('should throw an error when the file already exists', async ({ assert }) => {
    await Artisan.call('make:command TestCommand --no-register')
    await Artisan.call('make:command TestCommand --no-register')
  }).timeout(60000)

  test('should be able to replace template names and template values', async ({ assert }) => {
    TemplateHelper.setTemplateName({ __name__: 'Zap' })
    TemplateHelper.setTemplateValue({ namePascal: 'Zap' })

    await Artisan.call('make:command testCommands --no-register')

    const path = Path.console('Commands/ZapCommand.js')

    assert.isTrue(await File.exists(path))

    TemplateHelper.removeTemplateName({ __name__: 'Zap' })
    TemplateHelper.removeTemplateValue({ namePascal: 'Zap' })
  }).timeout(60000)
})
