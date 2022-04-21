/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path } from '@secjs/utils'
import { Artisan } from 'src/Facades/Artisan'
import { Command } from 'src/Commands/Command'
import { Command as Commander } from 'commander'

export class Start extends Command {
  /**
   * The name and signature of the console command.
   */
  protected signature = 'start'

  /**
   * The console command description.
   */
  protected description = 'Starts your project using node.'

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
  async handle(): Promise<void> {
    await Artisan.call('build')

    try {
      const mainPath = Path.noBuild().pwd('dist/bootstrap/main.js')
      const tsconfigPathsPath = Path.noBuild().pwd(
        'node_modules/tsconfig-paths',
      )

      await this.execCommand(
        `TS_NODE_BASEURL=./dist node -r ${tsconfigPathsPath}/register ${mainPath}`,
      )
    } catch (error) {
      this.error('Failed to start project.')
    }
  }
}
