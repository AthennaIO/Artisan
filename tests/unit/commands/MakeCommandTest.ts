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
import { Test, ExitFaker, type Context } from '@athenna/test'
import { BaseCommandTest } from '#tests/helpers/BaseCommandTest'

export default class MakeCommandTest extends BaseCommandTest {
  @Test()
  public async shouldBeAbleToCreateACommandFile({ assert }: Context) {
    await Artisan.call('make:command TestCommand', false)

    const path = Path.console('commands/TestCommand.ts')

    assert.isTrue(await File.exists(path))
    assert.isTrue(ExitFaker.faker.calledOnceWith(0))

    const { athenna } = await new File(Path.pwd('package.json')).getContentAsJson()

    assert.containsSubset(Config.get('rc.commands'), {
      testCommand: '#app/console/commands/TestCommand',
    })
    assert.containsSubset(athenna.commands, {
      testCommand: '#app/console/commands/TestCommand',
    })
  }

  @Test()
  public async shouldBeAbleToCreateACommandFileWithADifferentDestPathAndImportPath({ assert }: Context) {
    Config.set('rc.commands.make:command.path', Config.get('rc.commands.make:command'))
    Config.set('rc.commands.make:command.destination', './tests/stubs/storage/commands')

    await Artisan.call('make:command TestCommand', false)

    const path = Path.stubs('storage/commands/TestCommand.ts')

    assert.isTrue(await File.exists(path))
    assert.isTrue(ExitFaker.faker.calledOnceWith(0))

    const { athenna } = await new File(Path.pwd('package.json')).getContentAsJson()

    assert.containsSubset(Config.get('rc.commands'), {
      testCommand: '#tests/stubs/storage/commands/TestCommand',
    })
    assert.containsSubset(athenna.commands, {
      testCommand: '#tests/stubs/storage/commands/TestCommand',
    })
  }

  @Test()
  public async shouldThrowAnExceptionWhenTheFileAlreadyExists({ assert }: Context) {
    await Artisan.call('make:command TestCommand')
    await Artisan.call('make:command TestCommand')

    assert.isTrue(ExitFaker.faker.calledWith(1))
  }
}
