/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Argument, Command, CommanderHandler } from '#src'

export class ListCommand extends Command {
  @Argument()
  public alias: string

  public static signature(): string {
    return 'list'
  }

  public static description(): string {
    return 'List all commands available of the alias.'
  }

  public async handle(): Promise<void> {
    this.logger.title(`LISTING ${this.alias}\n`, 'bold', 'green')

    const commands = CommanderHandler.getCommands(this.alias)

    this.logger.column(commands, {
      columns: ['COMMAND', 'DESCRIPTION'],
    })
  }
}
