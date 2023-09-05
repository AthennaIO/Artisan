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
        `Expected message "${message}" to be logged in "stdout" but it was logged in "stderr"`,
      )
    }

    if (stream === 'stderr' && existsInStdout) {
      return this.assert.fail(
        `Expected message "${message}" to be logged in "stderr" but it was logged in "stdout"`,
      )
    }
  }

  /**
   * Assert command to log the expected message.
   */
  public assertLogMatches(regex: RegExp, stream?: 'stdout' | 'stderr') {
    const existsInStdout = regex.test(this.output.stdout)
    const existsInStderr = regex.test(this.output.stderr)

    this.assert.isTrue(existsInStdout || existsInStderr)

    if (stream === 'stdout' && existsInStderr) {
      return this.assert.fail(
        `Expected message to be matched in ${inspect(
          'stdout',
        )} but it was found in ${inspect('stderr')}`,
      )
    }

    if (stream === 'stderr' && existsInStdout) {
      return this.assert.fail(
        `Expected message to be matched in ${inspect(
          'stderr',
        )} but it was found in ${inspect('stdout')}`,
      )
    }
  }
}
