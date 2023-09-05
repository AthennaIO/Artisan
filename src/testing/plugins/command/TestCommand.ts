/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Artisan } from '#src'
import { Assert } from '@japa/assert'
import type { CommandOutput } from '@athenna/common'
import { TestOutput } from '#src/testing/plugins/command/TestOutput'

export class TestCommand {
  /**
   * The Artisan file path that will be used to run commands.
   */
  public static artisanPath = undefined

  /**
   * Set the artisan file path.
   */
  public static setArtisanPath(path: string): typeof TestCommand {
    this.artisanPath = path

    return this
  }

  /**
   * Japa assert class instance.
   */
  public assert = new Assert()

  /**
   * Instantiate TestOutput class from stdout, stderr and exitCode.
   */
  public createOutput(output: CommandOutput): TestOutput {
    return new TestOutput(this.assert, output)
  }

  /**
   * Run the command and return the TestOutput instance
   * to make assertions.
   */
  public async run(command: string): Promise<TestOutput> {
    return Artisan.callInChild(command, TestCommand.artisanPath).then(output =>
      this.createOutput(output),
    )
  }
}
