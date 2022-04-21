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

export class StartDev extends Command {
  /**
   * The name and signature of the console command.
   */
  protected signature = 'start:dev'

  /**
   * The console command description.
   */
  protected description = 'Starts your project using ts-node and nodemon.'

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
  async handle(options: any): Promise<void> {
    try {
      const nodemonPath = Path.noBuild().pwd('node_modules/.bin/nodemon')
      const tsNodePath = Path.noBuild().pwd('node_modules/.bin/ts-node')
      const mainPath = Path.noBuild().pwd('bootstrap/main.ts')
      const tsconfigPathsPath = Path.noBuild().pwd(
        'node_modules/tsconfig-paths',
      )

      let command = `${tsNodePath} -r tsconfig-paths/register ${mainPath}`

      if (options.nodemon) {
        command = `${nodemonPath} --quiet --ignore tests storage node_modules --watch '.' --exec '${tsNodePath} -r ${tsconfigPathsPath}/register ${mainPath}' -e ts`
      }

      await this.execCommand(command)
    } catch (error) {
      this.error('Failed to start project.')
    }
  }
}
