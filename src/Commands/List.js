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
   *
   * @return {string}
   */
  get signature() {
    return 'list <alias>'
  }

  /**
   * The console command description.
   *
   * @return {string}
   */
  get description() {
    return 'List all commands available of the alias.'
  }

  /**
   * Execute the console command.
   *
   * @param {string} alias
   * @return {Promise<void>}
   */
  async handle(alias) {
    this.title(`LISTING ${alias}\n`, 'bold', 'green')

    const commands =
      'Commands:' +
      Artisan.listCommands(true, alias)
        .split('\n')
        .map(line => `  ${line}`)
        .join('\n')

    this.log(commands)
  }
}
