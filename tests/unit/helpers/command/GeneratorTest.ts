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
import { Generator } from '#src/helpers/command/Generator'
import { Test, AfterEach, BeforeEach, type Context } from '@athenna/test'

export default class GeneratorTest {
  private generator = new Generator()

  @BeforeEach()
  public async beforeEach() {
    await Config.load(Path.fixtures('config/rc.ts'))
    new ViewProvider().register()
    this.generator = new Generator()
  }

  @AfterEach()
  public async afterEach() {
    await Folder.safeRemove(Path.fixtures('tmp'))
  }

  @Test()
  public async shouldBeAbleToGenerateFilesFromTemplates({ assert }: Context) {
    const path = Path.fixtures('tmp/GeneratorTestCommand.ts')

    await this.generator.path(path).template('command').make()

    assert.isTrue(await File.exists(path))
  }

  @Test()
  public async shouldBeAbleToGenerateFilesFromTemplatesWithoutNameProperties({ assert }: Context) {
    const path = Path.fixtures('tmp/GeneratorTestCommand.ts')

    await this.generator.path(path).setNameProperties(false).template('command').make()

    assert.isTrue(await File.exists(path))
    assert.isTrue(new File(path).getContentAsStringSync().includes('undefined'))
  }

  @Test()
  public async shouldBeAbleToGenerateFilesFromTemplatesWithCustomizedProperties({ assert }: Context) {
    const path = Path.fixtures('tmp/GeneratorTestCommand.ts')

    await this.generator.path(path).properties({ hello: true }).template('command').make()

    assert.isTrue(await File.exists(path))
  }

  @Test()
  public async shouldBeAbleToGenerateFilesFromTemplatesAndReplaceNamedProperties({ assert }: Context) {
    const path = Path.fixtures('tmp/GeneratorTestCommand.ts')

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
  public async shouldBeAbleToGenerateFilesFromTemplatesThatAreAlreadyRegisteredInView({ assert }: Context) {
    const path = Path.fixtures('tmp/GeneratorTestCommand.ts')

    View.createTemplateByPath('command', 'templates/command.edge')

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

  @Test()
  public async shouldBeAbleToGenerateFilesFromTemplatesSettingFileNameDestinationAndExt({ assert }: Context) {
    const path = Path.fixtures('tmp/GeneratorTestCommand.ts')

    View.createTemplateByPath('command', 'templates/command.edge')

    assert.isTrue(View.hasTemplate('command'))

    await this.generator
      .path(path)
      .fileName('GeneratorTestCommand')
      .extension('ts')
      .destination(Path.fixtures('tmp'))
      .properties({ namePascal: 'GeneratorTestCommandd' })
      .setNameProperties(true)
      .template('command')
      .make()

    assert.isTrue(await File.exists(path))
    assert.isTrue(new File(path).getContentAsStringSync().includes('GeneratorTestCommandd'))
  }
}
