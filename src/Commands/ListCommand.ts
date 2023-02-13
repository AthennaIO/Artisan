/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Argument, BaseCommand, Command, CommanderHandler } from '#src'

@Command()
export class ListCommand extends BaseCommand {
  @Argument()
  public alias: string

  public static signature(): string {
    return 'list'
  }

  public static description(): string {
    return 'List all commands available of the alias.'
  }

  public async handle(): Promise<void> {
    this.logger.simple(
      `({bold,green} [ LISTING ${this.alias.toUpperCase()} ])\n`,
    )

    const commands = CommanderHandler.getCommands(this.alias)

    this.logger.column(commands, {
      columns: ['COMMAND', 'DESCRIPTION'],
    })
  }
}
