/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CommanderHandler } from '#src'
import { Test, type Context, BeforeEach } from '@athenna/test'

export default class CommanderHandlerTest {
  @BeforeEach()
  public beforeEach() {
    CommanderHandler.reconstruct()
  }

  @Test()
  public async shouldBeAbleToParseArgumentsToExecuteACommand({ assert }: Context) {
    let NAME = null

    CommanderHandler.commander
      .command('test')
      .argument('<name>', 'The person name')
      .action((name: string) => {
        NAME = name
      })

    await CommanderHandler.parse(['node', 'artisan', 'test', 'João Lenon'])

    assert.equal(NAME, 'João Lenon')
  }

  @Test()
  public async shouldBeAbleToVerifyThatACommandIsRegisteredAndExists({ assert }: Context) {
    assert.isFalse(CommanderHandler.hasCommand('test'))

    CommanderHandler.commander
      .command('test')
      .argument('<name>', 'The person name')
      .action((name: string) => {
        console.log(name)
      })

    assert.isTrue(CommanderHandler.hasCommand('test'))
  }

  @Test()
  public async shouldBeAbleToGetAllCommanderInstancesOfTheRegisteredCommands({ assert }: Context) {
    CommanderHandler.commander
      .command('test')
      .argument('<name>', 'The person name')
      .action((name: string) => {
        console.log(name)
      })

    const commanders = CommanderHandler.getCommands()

    assert.lengthOf(commanders, 1)
    assert.equal(commanders[0].name(), 'test')
  }

  @Test()
  public async shouldBeAbleToGetACommanderInstanceOfTheCommandByItName({ assert }: Context) {
    CommanderHandler.commander
      .command('test')
      .argument('<name>', 'The person name')
      .action((name: string) => {
        console.log(name)
      })

    const commander = CommanderHandler.getCommand('test')

    assert.equal(commander.name(), 'test')
  }

  @Test()
  public async shouldBeAbleToReconstructTheCommanderInstance({ assert }: Context) {
    CommanderHandler.commander
      .command('test')
      .argument('<name>', 'The person name')
      .action((name: string) => {
        console.log(name)
      })

    assert.isTrue(CommanderHandler.hasCommand('test'))

    CommanderHandler.reconstruct()

    assert.isFalse(CommanderHandler.hasCommand('test'))
  }

  @Test()
  public async shouldBeAbleToGetTheArgumentsOfACommandByItName({ assert }: Context) {
    CommanderHandler.commander
      .command('test')
      .argument('<name>', 'The person name')
      .action((name: string) => {
        console.log(name)
      })

    const args = CommanderHandler.getCommandArgs('test')

    assert.lengthOf(args, 1)
    assert.equal(args[0].name(), 'name')
  }

  @Test()
  public async shouldBeAbleToGetTheOptionsOfACommandByItName({ assert }: Context) {
    CommanderHandler.commander
      .command('test')
      .argument('<name>', 'The person name')
      .option('-ag, --age', 'The person age')
      .action((name: string) => {
        console.log(name)
      })

    const opts = CommanderHandler.getCommandOpts('test')

    assert.lengthOf(opts, 1)
    assert.equal(opts[0].flags, '-ag, --age')
  }

  @Test()
  public async shouldBeAbleToGetTheOptionsValuesOfACommandByItNameDuringItExecution({ assert }: Context) {
    assert.plan(1)

    CommanderHandler.commander
      .command('test')
      .argument('<name>', 'The person name')
      .option('-ag, --age', 'The person age')
      .action(() => {
        const opts = CommanderHandler.getCommandOptsValues('test')

        assert.deepEqual(opts, { age: true, env: 'local' })
      })

    await CommanderHandler.parse(['node', 'artisan', 'test', 'João Lenon', '--age'])
  }

  @Test()
  public async shouldBeAbleToGetTheCommandsInfo({ assert }: Context) {
    CommanderHandler.commander
      .command('test')
      .description('The test command description')
      .argument('<name>', 'The person name')
      .option('-ag, --age', 'The person age')
      .action(() => {})

    const infos = CommanderHandler.getCommandsInfo()

    assert.deepEqual(infos, { 'test [options] <name>': 'The test command description' })
  }

  @Test()
  public async shouldBeAbleToGetTheCommandsInfoByAlias({ assert }: Context) {
    CommanderHandler.commander
      .command('test')
      .description('The test command description')
      .argument('<name>', 'The person name')
      .option('-ag, --age', 'The person age')
      .action(() => {})

    CommanderHandler.commander
      .command('make:test')
      .description('The make:test command description')
      .argument('<name>', 'The person name')
      .option('-ag, --age', 'The person age')
      .action(() => {})

    const infos = CommanderHandler.getCommandsInfo('make')

    assert.deepEqual(infos, { 'make:test [options] <name>': 'The make:test command description' })
  }

  @Test()
  public async shouldBeAbleToBindTheExecMethodWithTheTargetToBeRegisteredAsTheCommandAction({ assert }: Context) {
    class Command {
      async __exec(...args: any[]) {
        assert.equal(args[0], 'João Lenon')
        assert.deepEqual(args[1], { age: true })
      }
    }

    CommanderHandler.commander
      .command('test')
      .description('The test command description')
      .argument('<name>', 'The person name')
      .option('-ag, --age', 'The person age')
      .action(CommanderHandler.bindHandler(new Command()))

    await CommanderHandler.parse(['node', 'artisan', 'test', 'João Lenon', '--age'])
  }

  @Test()
  public async shouldBeAbleToRegisterAnExceptionHandlerToBeRegisteredWithTheTargetExecMethod({ assert }: Context) {
    assert.plan(1)

    class Command {
      async __exec() {
        throw new Error('error')
      }
    }

    CommanderHandler.exceptionHandler = (error: Error) => {
      assert.equal(error.message, 'error')
    }

    CommanderHandler.commander
      .command('test')
      .description('The test command description')
      .argument('<name>', 'The person name')
      .option('-ag, --age', 'The person age')
      .action(CommanderHandler.bindHandler(new Command()))

    await CommanderHandler.parse(['node', 'artisan', 'test', 'João Lenon', '--age'])
  }
}
