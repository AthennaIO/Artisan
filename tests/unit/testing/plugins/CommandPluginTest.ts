/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ArtisanProvider } from '#src/index'
import { TestCommand } from '#src/testing/plugins/index'
import { Test, type Context, BeforeEach, AfterEach, Fails } from '@athenna/test'

export default class CommandPluginTest {
  @BeforeEach()
  public beforeEach() {
    new ArtisanProvider().register()
    TestCommand.setArtisanPath(Path.fixtures('consoles/plugin-console.ts'))
  }

  @AfterEach()
  public afterEach() {
    ioc.reconstruct()
  }

  @Test()
  public async shouldBeAbleToExecuteCommandsUsingCommandPlugin({ command }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
  }

  @Test()
  public async shouldBeAbleToAssertThatCommandHasLoggedAMessage({ command }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertLogged('Hello stdout world!')
    output.assertLogged('Hello stderr world!')
  }

  @Test()
  public async shouldBeAbleToAssertThatCommandHasLoggedAMessageSpecificallyInStdout({ command }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertLogged('Hello stdout world!', 'stdout')
  }

  @Test()
  public async shouldBeAbleToAssertThatCommandHasLoggedAMessageSpecificallyInStderr({ command }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertLogged('Hello stderr world!', 'stderr')
  }

  @Test()
  public async shouldBeAbleToAssertThatCommandHasNotLoggedAMessage({ command }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertNotLogged('Not logged message')
  }

  @Test()
  public async shouldBeAbleToAssertThatCommandHasNotLoggedAMessageSpecificallyInStdout({ command }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertNotLogged('Hello stderr world!', 'stdout')
  }

  @Test()
  public async shouldBeAbleToAssertThatCommandHasNotLoggedAMessageSpecificallyInStderr({ command }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertNotLogged('Hello stdout world!', 'stderr')
  }

  @Test()
  @Fails()
  public async shouldFailIfLoggedAssertionFail({ command }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertLogged('Not logged message')
  }

  @Test()
  @Fails()
  public async shouldFailIfLoggedAssertionFailInStdout({ command }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertLogged('Hello stderr world!', 'stdout')
  }

  @Test()
  @Fails()
  public async shouldFailIfLoggedAssertionFailInStderr({ command }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertLogged('Hello stdout world!', 'stderr')
  }

  @Test()
  @Fails()
  public async shouldFailIfNotLoggedAssertionFailInStdout({ command }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertNotLogged('Hello stdout world!', 'stdout')
  }

  @Test()
  @Fails()
  public async shouldFailIfNotLoggedAssertionFailInStderr({ command }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertNotLogged('Hello stderr world!', 'stderr')
  }

  @Test()
  public async shouldBeAbleToAssertThatCommandHasFailed({ command }: Context) {
    const output = await command.run('plugin --throw')

    output.assertFailed()
  }

  @Test()
  public async shouldBeAbleToAssertTheCommandMatchesExitCodeZero({ command }: Context) {
    const output = await command.run('plugin')

    output.assertExitCode(0)
  }

  @Test()
  public async shouldBeAbleToAssertTheCommandMatchesExitCodeOne({ command }: Context) {
    const output = await command.run('plugin --throw')

    output.assertExitCode(1)
  }

  @Test()
  public async shouldBeAbleToAssertTheCommandDoesNotMatchExitCodeZero({ command }: Context) {
    const output = await command.run('plugin --throw')

    output.assertIsNotExitCode(0)
  }

  @Test()
  public async shouldBeAbleToAssertTheCommandDoesNotMatchExitCodeOne({ command }: Context) {
    const output = await command.run('plugin')

    output.assertIsNotExitCode(1)
  }

  @Test()
  public async shouldBeAbleToAssertThatCommandHasLoggedAMessageThatMatchesTheRegexp({ command }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertLogMatches(/Hello stdout world!/)
    output.assertLogMatches(/Hello stderr world!/)
  }

  @Test()
  public async shouldBeAbleToAssertThatCommandHasLoggedAMessageThatMatchesTheRegexpSpecificallyInStdout({
    command
  }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertLogMatches(/Hello stdout world!/, 'stdout')
  }

  @Test()
  public async shouldBeAbleToAssertThatCommandHasLoggedAMessageThatMatchesTheRegexpSpecificallyInStderr({
    command
  }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertLogMatches(/Hello stderr world!/, 'stderr')
  }

  @Test()
  public async shouldBeAbleToAssertThatCommandHasNotLoggedAMessageThatMatchesTheRegexp({ command }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertLogNotMatches(/Not logged message/)
  }

  @Test()
  public async shouldBeAbleToAssertThatCommandHasNotLoggedAMessageThatMatchesTheRegexpSpecificallyInStdout({
    command
  }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertLogNotMatches(/Hello stderr world!/, 'stdout')
  }

  @Test()
  public async shouldBeAbleToAssertThatCommandHasNotLoggedAMessageThatMatchesTheRegexpSpecificallyInStderr({
    command
  }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertLogNotMatches(/Hello stdout world!/, 'stderr')
  }

  @Test()
  @Fails()
  public async shouldFailIfLogMatchesAssertionFailInStdout({ command }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertLogMatches(/Hello stderr world!/, 'stdout')
  }

  @Test()
  @Fails()
  public async shouldFailIfLogMatchesAssertionFailInStderr({ command }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertLogMatches(/Hello stdout world!/, 'stderr')
  }

  @Test()
  @Fails()
  public async shouldFailIfLogNotMatchesAssertionFailInStdout({ command }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertLogNotMatches(/Hello stdout world!/, 'stdout')
  }

  @Test()
  @Fails()
  public async shouldFailIfLogNotMatchesAssertionFailInStderr({ command }: Context) {
    const output = await command.run('plugin')

    output.assertSucceeded()
    output.assertLogNotMatches(/Hello stderr world!/, 'stderr')
  }

  @Test()
  public async shouldBeAbleToCheckAndManipulateTheCommandOutput({ assert, command }: Context) {
    const output = await command.run('plugin')

    assert.isDefined(output.output.stdout)
    assert.isDefined(output.output.stderr)
    assert.isDefined(output.output.exitCode)
  }
}
