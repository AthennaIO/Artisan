/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { parse } from 'node:path'
import { Path } from '@secjs/utils'
import { Command } from '#src/index'

export class MakeFix extends Command {
  /**
   * The name and signature of the console command.
   *
   * @return {string}
   */
  get signature() {
    return 'eslint:fix <filePath>'
  }

  /**
   * The console command description.
   *
   * @return {string}
   */
  get description() {
    return 'Lint one specific file using eslint.'
  }

  /**
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @param {import('commander').Command} commander
   * @return {import('commander').Command}
   */
  addFlags(commander) {
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
   * @param {string} filePath
   * @param {any} options
   * @return {Promise<void>}
   */
  async handle(filePath, options) {
    if (!options.quiet) {
      this.simpleLog(
        `[ LINTING ${options.resource.toUpperCase()} ]\n`,
        'bold',
        'green',
      )
    }

    const { name } = parse(filePath)

    await this.execCommand(`${Path.bin('eslint')} ${filePath} --fix --quiet`)

    if (!options.quiet) {
      this.success(
        `${options.resource} ({yellow} "${name}") successfully linted.`,
      )
    }
  }
}
