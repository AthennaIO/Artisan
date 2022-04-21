/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path } from '@secjs/utils'
import { Command } from 'src/Commands/Command'
import { Command as Commander } from 'commander'

export class Test extends Command {
  /**
   * The name and signature of the console command.
   */
  protected signature = 'test'

  /**
   * The console command description.
   */
  protected description = 'Run your project tests using jest.'

  /**
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @return {void}
   */
  public addFlags(commander: Commander): Commander {
    return commander
  }

  /**
   * Execute the console command.
   *
   * @return {Promise<void>}
   */
  async handle(_: any, commander: any): Promise<void> {
    try {
      const jestPath = Path.noBuild().pwd('node_modules/.bin/jest')
      const jestArgs = commander.args.join(' ')

      let command = `${jestPath}`

      if (jestArgs) {
        command = command.concat(` ${jestArgs}`)
      }

      await this.execCommand(command)
    } catch (error) {
      this.error('Failed to test project.')
    }
  }
}
