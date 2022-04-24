/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { parse } from 'path'
import { Path } from '@secjs/utils'
import { Command } from 'src/Commands/Command'
import { Commander } from 'src/Contracts/Commander'
import { EslintException } from 'src/Exceptions/EslintException'

export class Fix extends Command {
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
        'rmNewLineStart',
        'bold',
        'green',
      )
    }

    const { name } = parse(filePath)

    try {
      const eslintPath = Path.noBuild().pwd('node_modules/.bin/eslint')

      await this.execCommand(`${eslintPath} ${filePath} --fix --quiet`)

      if (!options.quiet) {
        this.success(
          `${options.resource} ({yellow} "${name}") successfully linted.`,
        )
      }
    } catch (error) {
      if (!options.quiet) {
        throw new EslintException(options.resource, name)
      }
    }
  }
}
