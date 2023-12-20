/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { TestContext } from '@japa/runner/core'
import { TestCommand } from '#src/testing/plugins/command/TestCommand'

declare module '@japa/runner/core' {
  interface TestContext {
    command: TestCommand
  }
}

export * from '#src/testing/plugins/command/TestCommand'
export * from '#src/testing/plugins/command/TestOutput'

/**
 * Command plugin registers the command macro to the test context.
 */
export function command() {
  return function () {
    TestContext.macro('command', new TestCommand())
  }
}
