/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Artisan } from '#src'
import { Config } from '@athenna/config'
import { File, Folder } from '@athenna/common'
import { Test, ExitFaker } from '@athenna/test'
import type { Context } from '@athenna/test/types'
import { BaseCommandTest } from '#tests/helpers/BaseCommandTest'

export default class TemplateCustomizeCommandTest extends BaseCommandTest {
  @Test()
  public async shouldBeAbleToPublishTheAthennaTemplatesToDoCustomCustomizations({ assert }: Context) {
    await Artisan.call('template:customize', false)

    const path = Path.resources()

    const { athenna } = await new File(Path.pwd('package.json')).getContentAsJson()

    assert.isTrue(await Folder.exists(path))
    assert.isTrue(ExitFaker.faker.calledOnceWith(0))
    assert.isTrue(await File.exists(path.concat('/templates/command.edge')))
    assert.equal(athenna.view.templates.command, './resources/templates/command.edge')
  }

  @Test()
  public async shouldNotThrowErrorsIfTheTemplatePathAlreadyExistsInsideResourcesTemplates({ assert }: Context) {
    const templatePath = Path.resources('templates/test.edge')
    await new File(templatePath, '').load()

    Config.set('rc.templates.test', templatePath)

    await Artisan.call('template:customize', false)

    const path = Path.resources()

    assert.isTrue(await Folder.exists(path))
    assert.isTrue(await File.exists(templatePath))
    assert.isTrue(ExitFaker.faker.calledOnceWith(0))
    assert.isTrue(await File.exists(path.concat('/templates/command.edge')))
  }
}
