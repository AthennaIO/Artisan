/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import nodemon from 'nodemon'

import { Module, Path } from '@secjs/utils'

import { Command } from '#src/index'

export class Serve extends Command {
  /**
   * The name and signature of the console command.
   *
   * @return {string}
   */
  get signature() {
    return 'serve'
  }

  /**
   * The console command description.
   *
   * @return {string}
   */
  get description() {
    return 'Serve the Athenna application.'
  }

  /**
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @param {import('commander').Command} commander
   * @return {import('commander').Command}
   */
  addFlags(commander) {
    return commander.option(
      '-w, --watch',
      'Watch for file changes and re-start the application on change',
      false,
    )
  }

  /**
   * Execute the console command.
   *
   * @params {any} options
   * @return {Promise<void>}
   */
  async handle(options) {
    process.env.BOOT_LOGS = 'true'

    if (options.watch) {
      const ignorePaths = `--ignore ${Path.tests()} ${Path.storage()} ${Path.nodeModules()}`

      nodemon(
        `--quiet ${ignorePaths} --watch ${Path.pwd()} --exec 'node ${Path.bootstrap(
          'main.js',
        )}'`,
      )

      return
    }

    await Module.import(Path.bootstrap('main.js'))
  }
}
