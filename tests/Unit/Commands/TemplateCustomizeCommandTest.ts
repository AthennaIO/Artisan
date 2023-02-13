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
import { File, Folder } from '@athenna/common'
import { LoggerProvider } from '@athenna/logger'
import { ExitFaker } from '#tests/Helpers/ExitFaker'
import { Artisan, ConsoleKernel, ArtisanProvider } from '#src'

test.group('TemplateCustomizeCommandTest', group => {
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
    await Folder.safeRemove(Path.resources())
  })

  test('should be able to publish the athenna templates to do custom customizations', async ({ assert }) => {
    await Artisan.call('template:customize')

    const path = Path.resources()

    assert.isTrue(await Folder.exists(path))
    assert.isTrue(ExitFaker.faker.calledOnceWith(0))
    assert.isTrue(await File.exists(path.concat('/templates/command.edge')))
  })

  test('should not export templates that are already inside resources/templates path', async ({ assert }) => {
    const templatePath = Path.resources('templates/test.edge')
    await new File(templatePath, Buffer.from('')).load()

    Config.set('view.templates.paths.test', templatePath)

    await Artisan.call('template:customize')

    const path = Path.resources()

    assert.isTrue(await Folder.exists(path))
    assert.isTrue(await File.exists(templatePath))
    assert.isTrue(ExitFaker.faker.calledOnceWith(0))
    assert.isTrue(await File.exists(path.concat('/templates/command.edge')))
  })
})
