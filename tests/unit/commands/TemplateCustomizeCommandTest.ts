/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { File, Folder } from '@athenna/common'
import { BaseTest } from '#tests/helpers/BaseTest'
import { Test, type Context } from '@athenna/test'

export default class TemplateCustomizeCommandTest extends BaseTest {
  @Test()
  public async shouldBeAbleToPublishTheAthennaTemplatesToMakeCustomCustomizations({ assert, command }: Context) {
    const output = await command.run('template:customize')

    const { athenna } = await new File(Path.pwd('package.json')).getContentAsJson()

    output.assertSucceeded()
    output.assertLogged('[ MOVING TEMPLATES ]')
    output.assertLogged('Athenna RC updated:')
    output.assertLogged('"command": "./resources/templates/command.edge"')
    output.assertLogged('[  success  ] Template files successfully moved to resources/templates folder.')
    assert.isTrue(await Folder.exists(Path.resources()))
    assert.isTrue(await File.exists(Path.resources('templates/command.edge')))
    assert.equal(athenna.templates.command, './resources/templates/command.edge')
  }

  @Test()
  public async shouldNotThrowErrorsIfTheTemplatePathAlreadyExistsInsideResourcesTemplates({
    assert,
    command
  }: Context) {
    const output = await command.run('template:customize', {
      path: Path.fixtures('consoles/console-mock-test-template.ts')
    })

    const { athenna } = await new File(Path.pwd('package.json')).getContentAsJson()

    output.assertSucceeded()
    output.assertLogged('[ MOVING TEMPLATES ]')
    output.assertLogged('Athenna RC updated:')
    output.assertLogged('"command": "./resources/templates/command.edge"')
    output.assertLogged('"test": "./resources/templates/test.edge"')
    output.assertLogged('[  success  ] Template files successfully moved to resources/templates folder.')
    assert.isTrue(await Folder.exists(Path.resources()))
    assert.isTrue(await File.exists(Path.resources('templates/test.edge')))
    assert.isTrue(await File.exists(Path.resources('templates/command.edge')))
    assert.equal(athenna.templates.command, './resources/templates/command.edge')
  }
}
