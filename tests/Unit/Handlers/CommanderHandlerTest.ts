/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CommanderHandler } from '#src'
import { Test, TestContext } from '@athenna/test'
import { ListCommand } from '#src/Commands/ListCommand'
import { BaseCommandTest } from '#tests/Helpers/BaseCommandTest'

export default class CommanderHandlerTest extends BaseCommandTest {
  @Test()
  public async shouldBeAbleToGetAllTheCommandsRegisteredInsideCommander({ assert }: TestContext) {
    CommanderHandler.getCommander<any>().commands = []

    CommanderHandler.getCommander()
      .command('configure <libraries>')
      .description('Configure one or more libraries inside your application.')

    const commands = CommanderHandler.getCommands()

    assert.deepEqual(commands, {
      'configure <libraries>': 'Configure one or more libraries inside your application.',
    })
  }

  @Test()
  public async shouldBeAbleToGetAllTheCommandsRegisteredInsideCommanderBySomeAlias({ assert }: TestContext) {
    // CommanderHandler.getCommander<any>().commands = []

    CommanderHandler.getCommander()
      .command('configure <libraries>')
      .description('Configure one or more libraries inside your application.')

    CommanderHandler.getCommander().command('make:command <name>').description('Make a new command file.')
    CommanderHandler.getCommander().command('make:controller <name>').description('Make a new controller file.')

    const commands = CommanderHandler.getCommands('make')

    assert.deepEqual(commands, {
      'make:command <name>': 'Make a new command file.',
      'make:controller <name>': 'Make a new controller file.',
    })
  }

  @Test()
  public async shouldBeAbleToSetTheCliVersion({ assert }: TestContext) {
    CommanderHandler.setVersion('v3.0.0')

    assert.equal(CommanderHandler.getCommander<any>()._version, 'v3.0.0')
  }

  @Test()
  public async shouldBeAbleToSetTheOficialAthennaVersionIfNoneIsVersionIsSed({ assert }: TestContext) {
    CommanderHandler.setVersion()

    assert.equal(CommanderHandler.getCommander<any>()._version, 'Athenna Framework v3.0.0')
  }

  @Test()
  public async shouldBeAbleToGetTheExecMethodBindedWithoutExceptionHandler({ assert }: TestContext) {
    CommanderHandler.setExceptionHandler(undefined)

    const exec = CommanderHandler.bindHandler(new ListCommand())

    assert.isDefined(exec)
  }
}
