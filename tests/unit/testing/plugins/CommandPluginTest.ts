/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Test, type Context } from '@athenna/test'
import { BaseCommandTest } from '#tests/helpers/BaseCommandTest'

export default class CommandPluginTest extends BaseCommandTest {
  @Test()
  public async shouldBeAbleToExecuteCommandsUsingCommandPlugin({ command }: Context) {
    const output = await command.run('test hello')

    output.assertSucceeded()
    output.assertLogged('hello notRequiredArg undefined notRequiredOption')
    output.assertLogged("true tests|node_modules [ 'tests', 'node_modules' ]")
  }

  @Test()
  public async shouldBeAbleToAssertThatTheExitCodeIsNotSomeValue({ command }: Context) {
    const output = await command.run('test hello')

    output.assertIsNotExitCode(1)
  }

  @Test()
  public async shouldBeAbleToAssertThatTheLogMessageMatchesARegex({ command }: Context) {
    const output = await command.run('test hello')

    output.assertLogMatches(/hello notRequiredArg undefined notRequiredOption/)
  }

  @Test()
  public async shouldBeAbleToAssertThatTheCommandFailed({ command }: Context) {
    const output = await command.run('test')

    output.assertFailed()
  }

  @Test()
  public async shouldBeAbleToCheckAndManipulateTheCommandOutput({ assert, command }: Context) {
    const output = await command.run('test hello')

    assert.isDefined(output.output.stdout)
    assert.isDefined(output.output.stderr)
    assert.isDefined(output.output.exitCode)
  }
}
