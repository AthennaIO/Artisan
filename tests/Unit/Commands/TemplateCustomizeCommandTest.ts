/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Config } from '@athenna/config'
import { ViewProvider } from '@athenna/view'
import { File, Folder } from '@athenna/common'
import { LoggerProvider } from '@athenna/logger'
import { ExitFaker } from '#tests/Helpers/ExitFaker'
import { Artisan, ConsoleKernel, ArtisanProvider } from '#src'
import { AfterAll, BeforeEach, Test, TestContext } from '@athenna/test'

export default class TemplateCustomizeCommandTest {
  private originalPJson = new File(Path.pwd('package.json')).getContentAsStringSync()

  @BeforeEach()
  public async beforeEach() {
    ExitFaker.fake()

    process.env.IS_TS = 'true'

    await Config.loadAll(Path.stubs('config'))

    new ViewProvider().register()
    new LoggerProvider().register()
    new ArtisanProvider().register()

    const kernel = new ConsoleKernel()

    await kernel.registerExceptionHandler()
    await kernel.registerCommands()
  }

  @AfterAll()
  public async afterAll() {
    ExitFaker.release()

    await Folder.safeRemove(Path.app())
    await Folder.safeRemove(Path.resources())

    await new File(Path.pwd('package.json')).setContent(this.originalPJson)
  }

  @Test()
  public async shouldBeAbleToPublishTheAthennaTemplatesToDoCustomCustomizations({ assert }: TestContext) {
    await Artisan.call('template:customize')

    const path = Path.resources()

    const { athenna } = await new File(Path.pwd('package.json')).getContentAsJson()

    assert.isTrue(await Folder.exists(path))
    assert.isTrue(ExitFaker.faker.calledOnceWith(0))
    assert.isTrue(await File.exists(path.concat('/templates/command.edge')))
    assert.equal(athenna.view.templates.command, './resources/templates/command.edge')
  }

  @Test()
  public async shouldNotExportTemplatesThatAreAlreadyInsideResourcesTemplatesPath({ assert }: TestContext) {
    const templatePath = Path.resources('templates/test.edge')
    await new File(templatePath, '').load()

    Config.set('view.templates.paths.test', templatePath)

    await Artisan.call('template:customize')

    const path = Path.resources()

    assert.isTrue(await Folder.exists(path))
    assert.isTrue(await File.exists(templatePath))
    assert.isTrue(ExitFaker.faker.calledOnceWith(0))
    assert.isTrue(await File.exists(path.concat('/templates/command.edge')))
  }
}
