/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { parse } from 'path'
import { Command } from 'src/Commands/Command'
import { Command as Commander } from 'commander'

export class Eslint extends Command {
  /**
   * The name and signature of the console command.
   */
  protected signature = 'eslint:fix <filePath>'

  /**
   * The console command description.
   */
  protected description = 'Lint one specific file using eslint.'

  /**
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @return {void}
   */
  public addFlags(commander: Commander) {
    return commander
      .option(
        '-r --resource <resource>',
        'Set the resource that will be linted.',
      )
      .option('--quiet', 'Set quiet mode to remove logs', false)
  }

  /**
   * Execute the console command.
   *
   * @return {Promise<void>}
   */
  async handle(filePath: string, options: any): Promise<void> {
    if (!options.quiet) {
      this.simpleLog(
        `[ LINTING ${options.resource.toUpperCase()} ]`,
        'bold',
        'green',
      )
    }

    const { name } = parse(filePath)

    try {
      await this.execCommand(
        `./node_modules/.bin/eslint ${filePath} --fix --quiet`,
      )

      if (!options.quiet) {
        this.success(
          `${options.resource} ({yellow} "${name}") successfully linted.`,
        )
      }
    } catch (error) {
      if (!options.quiet) {
        this.error(
          `Failed to lint ${options.resource} ({yellow} "${name}"). Please check your eslint configurations.`,
        )
      }
    }
  }
}
