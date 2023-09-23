/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { inspect } from 'node:util'
import type { Assert } from '@athenna/test'
import type { CommandOutput } from '@athenna/common'

export class TestOutput {
  /**
   * Japa assert class instance.
   */
  public assert: Assert

  /**
   * The command output object.
   */
  public output: CommandOutput

  public constructor(assert: Assert, output: CommandOutput) {
    this.assert = assert
    this.output = output
  }

  /**
   * Assert the exit code of the output.
   *
   * @example
   * ```js
   * output.assertExitCode(1)
   * ```
   */
  public assertExitCode(code: number) {
    this.assert.deepEqual(this.output.exitCode, code)
  }

  /**
   * Assert the exit code of the output.
   *
   * @example
   * ```js
   * output.assertIsNotExitCode(1)
   * ```
   */
  public assertIsNotExitCode(code: number) {
    this.assert.notDeepEqual(this.output.exitCode, code)
  }

  /**
   * Assert the command exists with zero exit code.
   */
  public assertSucceeded() {
    return this.assertExitCode(0)
  }

  /**
   * Assert the command exists with non-zero exit code.
   */
  public assertFailed() {
    return this.assertIsNotExitCode(0)
  }

  /**
   * Assert command to log the expected message.
   */
  public assertLogged(message: string, stream?: 'stdout' | 'stderr') {
    const existsInStdout = this.output.stdout.includes(message)
    const existsInStderr = this.output.stdout.includes(message)

    this.assert.isTrue(existsInStdout || existsInStderr)

    if (stream === 'stdout' && existsInStderr) {
      return this.assert.fail(
        `Expected message "${message}" to be logged in "stdout" but it was logged in "stderr"`
      )
    }

    if (stream === 'stderr' && existsInStdout) {
      return this.assert.fail(
        `Expected message "${message}" to be logged in "stderr" but it was logged in "stdout"`
      )
    }
  }

  /**
   * Assert command to have not log the message.
   */
  public assertNotLogged(message: string, stream?: 'stdout' | 'stderr') {
    const existsInStdout = this.output.stdout.includes(message)
    const existsInStderr = this.output.stdout.includes(message)

    switch (stream) {
      case 'stdout':
        this.assert.isFalse(existsInStdout)

        break
      case 'stderr':
        this.assert.isFalse(existsInStderr)

        break
      default:
        this.assert.isFalse(existsInStdout)
        this.assert.isFalse(existsInStderr)
    }
  }

  /**
   * Assert command to have a log that matches the regex.
   */
  public assertLogMatches(regex: RegExp, stream?: 'stdout' | 'stderr') {
    const existsInStdout = regex.test(this.output.stdout)
    const existsInStderr = regex.test(this.output.stderr)

    this.assert.isTrue(existsInStdout || existsInStderr)

    if (stream === 'stdout' && existsInStderr) {
      return this.assert.fail(
        `Expected message to be matched in ${inspect(
          'stdout'
        )} but it was found in ${inspect('stderr')}`
      )
    }

    if (stream === 'stderr' && existsInStdout) {
      return this.assert.fail(
        `Expected message to be matched in ${inspect(
          'stderr'
        )} but it was found in ${inspect('stdout')}`
      )
    }
  }

  /**
   * Assert command to not have a log that matches the regexp.
   */
  public assertLogNotMatches(regex: RegExp, stream?: 'stdout' | 'stderr') {
    const existsInStdout = regex.test(this.output.stdout)
    const existsInStderr = regex.test(this.output.stderr)

    switch (stream) {
      case 'stdout':
        this.assert.isFalse(existsInStdout)

        break
      case 'stderr':
        this.assert.isFalse(existsInStderr)

        break
      default:
        this.assert.isFalse(existsInStdout)
        this.assert.isFalse(existsInStderr)
    }
  }
}
