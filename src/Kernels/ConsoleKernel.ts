/**
 * @athenna/architect
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { resolveModule } from '@secjs/utils'
import { Command } from 'src/Commands/Command'
import { Architect } from 'src/Facades/Architect'

export abstract class ConsoleKernel {
  /**
   * Register the commands for the application.
   *
   * @return void
   */
  protected abstract commands: Command[] | Promise<any>[]

  /**
   * Register all the commands to the architect.
   *
   * @return void
   */
  async registerCommands(): Promise<void> {
    for (const module of this.commands) {
      let Command = resolveModule(await module)

      if (!ioc.hasDependency(`App/Commands/${Command.name}`)) {
        ioc.bind(`App/Commands/${Command.name}`, Command)
      }

      Command = ioc.safeUse(`App/Commands/${Command.name}`)

      Architect.register(commander => {
        commander = commander
          .command(Command.signature)
          .description(Command.description)

        Command.setFlags(commander)
          .action(Command.handle.bind(Command))
          .showHelpAfterError()
          .createHelp()
      })
    }
  }
}
