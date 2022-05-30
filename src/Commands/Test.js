/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path } from '@secjs/utils'

import { Command } from '#src/index'

export class Test extends Command {
  /**
   * The name and signature of the console command.
   */
  signature = 'test'

  /**
   * The console command description.
   */
  description = 'Run the tests of Athenna application.'

  /**
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @param {import('commander').Command} commander
   * @return {import('commander').Command}
   */
  addFlags(commander) {
    return commander
      .option('--c8-args', 'Arguments for c8 cli if needed.', '')
      .option('--japa-args', 'Arguments for japa cli if needed.', '')
      .option('--coverage', 'Coverage the code lines using c8 library.', false)
      .option('--debug', 'Enable debug mode to see more logs.', false)
      .option('--unit', 'Run unit tests.', false)
      .option('--e2e', 'Run e2e tests.', false)
  }

  /**
   * Execute the console command.
   *
   * @params {any} options
   * @return {Promise<void>}
   */
  async handle(options) {
    process.env.BOOT_LOGS = 'false'
    let command = ''

    if (options.coverage) {
      command = command.concat(`${Path.bin('c8')} ${options.c8Args} `)
    }

    if (options.debug) {
      command = command.concat(`${Path.bin('cross-env')} DEBUG=api:* && `)
    }

    command = command.concat(`node ${Path.tests('main.js')} `)

    if (options.unit) {
      command = command.concat('Unit ')
    }

    if (options.e2e) {
      command = command.concat('E2E ')
    }

    await this.execCommand(command)
  }
}
