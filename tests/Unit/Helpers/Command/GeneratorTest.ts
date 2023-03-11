/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Config } from '@athenna/config'
import { View, ViewProvider } from '@athenna/view'
import { File, Folder, Path } from '@athenna/common'
import { Generator } from '#src/Helpers/Command/Generator'
import { AfterEach, BeforeEach, Test, TestContext } from '@athenna/test'

export default class GeneratorTest {
  private generator = new Generator()

  @BeforeEach()
  public async beforeEach() {
    new ViewProvider().register()
    await Config.load(Path.stubs('config/rc.ts'))
    this.generator = new Generator()
  }

  @AfterEach()
  public async afterEach() {
    await Folder.safeRemove(Path.stubs('tmp'))
  }

  @Test()
  public async shouldBeAbleToGenerateFilesFromTemplates({ assert }: TestContext) {
    const path = Path.stubs('tmp/GeneratorTestCommand.ts')

    await this.generator.path(path).template('command').make()

    assert.isTrue(await File.exists(path))
  }

  @Test()
  public async shouldBeAbleToGenerateFilesFromTemplatesWithoutNameProperties({ assert }: TestContext) {
    const path = Path.stubs('tmp/GeneratorTestCommand.ts')

    await this.generator.path(path).setNameProperties(false).template('command').make()

    assert.isTrue(await File.exists(path))
    assert.isTrue(new File(path).getContentAsStringSync().includes('undefined'))
  }

  @Test()
  public async shouldBeAbleToGenerateFilesFromTemplatesWithCustomizedProperties({ assert }: TestContext) {
    const path = Path.stubs('tmp/GeneratorTestCommand.ts')

    await this.generator.path(path).properties({ hello: true }).template('command').make()

    assert.isTrue(await File.exists(path))
  }

  @Test()
  public async shouldBeAbleToGenerateFilesFromTemplatesAndReplaceNamedProperties({ assert }: TestContext) {
    const path = Path.stubs('tmp/GeneratorTestCommand.ts')

    await this.generator
      .path(path)
      .properties({ namePascal: 'GeneratorTestCommandd' })
      .setNameProperties(true)
      .template('command')
      .make()

    assert.isTrue(await File.exists(path))
    assert.isTrue(new File(path).getContentAsStringSync().includes('GeneratorTestCommandd'))
  }

  @Test()
  public async shouldBeAbleToGenerateFilesFromTemplatesThatAreAlreadyRegisteredInView({ assert }: TestContext) {
    const path = Path.stubs('tmp/GeneratorTestCommand.ts')

    View.createTemplate('command', await new File('../../../../templates/command.edge').getContentAsString())

    assert.isTrue(View.hasTemplate('command'))

    await this.generator
      .path(path)
      .properties({ namePascal: 'GeneratorTestCommandd' })
      .setNameProperties(true)
      .template('command')
      .make()

    assert.isTrue(await File.exists(path))
    assert.isTrue(new File(path).getContentAsStringSync().includes('GeneratorTestCommandd'))
  }
}
