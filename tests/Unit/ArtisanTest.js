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

test.group('ArtisanTest', group => {
  group.each.setup(async () => {
    await new Folder(Path.stubs('app')).copy(Path.app())
    await new Folder(Path.stubs('config')).copy(Path.config())
    await new File(Path.stubs('artisan.js')).copy(Path.pwd('artisan.js'))

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
    await File.safeRemove(Path.pwd('artisan.js'))
  })

  test('should be able to execute test:error command from routes/console', async ({ assert }) => {
    await import('#tests/Stubs/routes/console')

    const notTreatedError = await Artisan.callInChild('test:error')

    assert.isTrue(notTreatedError.stderr.includes('Testing Error'))

    const treatedError = await Artisan.callInChild('test:error treated')

    assert.isTrue(treatedError.stderr.includes('Testing Exception'))
  }).timeout(60000)

  test('should be able to set custom templates on artisan template helper', async ({ assert }) => {
    TemplateHelper.addTemplate(Path.stubs('templates/command.ejs'))

    await Artisan.call('make:command CustomCommand')

    const file = await new File(Path.console('Commands/CustomCommand.js')).load({ withContent: true })

    assert.isTrue(file.content.toString().includes('Custom template command!'))
  }).timeout(60000)
})
