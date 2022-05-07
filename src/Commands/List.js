/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Artisan, Command } from '#src/index'

export class List extends Command {
  /**
   * The name and signature of the console command.
   */
  signature = 'list <alias>'

  /**
   * The console command description.
   */
  description = 'List all commands available of the alias.'

  /**
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @param {import('commander').Command} commander
   * @return {import('commander').Command}
   */
  addFlags(commander) {
    return commander
  }

  /**
   * Execute the console command.
   *
   * @param {string} alias
   * @return {Promise<void>}
   */
  async handle(alias) {
    this.simpleLog(
      `[ LISTING ${alias.toUpperCase()} ]`,
      'rmNewLineStart',
      'bold',
      'green',
    )

    const commands =
      'Commands:' +
      Artisan.listCommands(true, alias)
        .split('\n')
        .map(line => `  ${line}`)
        .join('\n')

    this.simpleLog(commands)
  }
}
