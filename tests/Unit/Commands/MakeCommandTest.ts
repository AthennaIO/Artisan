/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Artisan } from '#src'
import { File } from '@athenna/common'
import { Config } from '@athenna/config'
import { Test, ExitFaker, TestContext } from '@athenna/test'
import { BaseCommandTest } from '#tests/Helpers/BaseCommandTest'

export default class MakeCommandTest extends BaseCommandTest {
  @Test()
  public async shouldBeAbleToCreateACommandFile({ assert }: TestContext) {
    await Artisan.call('make:command TestCommand')

    const path = Path.console('Commands/TestCommand.ts')

    assert.isTrue(await File.exists(path))
    assert.isTrue(ExitFaker.faker.calledOnceWith(0))

    const { athenna } = await new File(Path.pwd('package.json')).getContentAsJson()

    assert.equal(Config.get('rc.isInPackageJson', false), true)
    assert.notContainsSubset(athenna.commands, { isInPackageJson: true })

    assert.containsSubset(Config.get('rc.commands'), {
      testCommand: '#app/Console/Commands/TestCommand',
    })
    assert.containsSubset(athenna.commands, {
      testCommand: '#app/Console/Commands/TestCommand',
    })
  }

  @Test()
  public async shouldBeAbleToCreateACommandFileWithADifferentDestPathAndImportPath({ assert }: TestContext) {
    Config.set('rc.commands.make:command.path', Config.get('rc.commands.make:command'))
    Config.set('rc.commands.make:command.destination', './tests/Stubs/storage/commands')

    await Artisan.call('make:command TestCommand')

    const path = Path.stubs('storage/commands/TestCommand.ts')

    assert.isTrue(await File.exists(path))
    assert.isTrue(ExitFaker.faker.calledOnceWith(0))

    const { athenna } = await new File(Path.pwd('package.json')).getContentAsJson()

    assert.containsSubset(Config.get('rc.commands'), {
      testCommand: '#tests/Stubs/storage/commands/TestCommand',
    })
    assert.containsSubset(athenna.commands, {
      testCommand: '#tests/Stubs/storage/commands/TestCommand',
    })
  }

  @Test()
  public async shouldThrowAnExceptionWhenTheFileAlreadyExists({ assert }: TestContext) {
    await Artisan.call('make:command TestCommand')
    await Artisan.call('make:command TestCommand')

    assert.isTrue(ExitFaker.faker.calledWith(1))
  }
}
