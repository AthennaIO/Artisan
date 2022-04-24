/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Env } from '@athenna/config'
import { Artisan } from 'src/Facades/Artisan'
import { Command } from 'src/Commands/Command'
import { Path, resolveModule } from '@secjs/utils'

export abstract class ConsoleKernel {
  /**
   * Register the commands for the application.
   *
   * @return void
   */
  protected abstract commands: Command[] | Promise<any>[]

  /**
   * Register all the commands to the artisan.
   *
   * @return void
   */
  async registerCommands(): Promise<void> {
    for (const module of this.commands) {
      let Command = resolveModule(await module)

      if (!ioc.hasDependency(`App/Console/Commands/${Command.name}`)) {
        ioc.bind(`App/Console/Commands/${Command.name}`, Command)
      }

      Command = ioc.safeUse(`App/Console/Commands/${Command.name}`)

      /**
       * Action runner catches all exceptions thrown by commands
       * exceptions and sends to the Artisan exception handler.
       *
       * @param fn
       */
      function actionRunner(fn: (...args) => Promise<any>) {
        return (...args) => fn(...args).catch(Artisan.getErrorHandler())
      }

      Artisan.register(commander => {
        commander = commander
          .command(Command.signature)
          .description(Command.description)

        Command.addFlags(commander)
          .action(actionRunner(Command.handle.bind(Command)))
          .showHelpAfterError()
          .createHelp()
      })
    }
  }

  /**
   * Register the default error handler
   *
   * @return void
   */
  async registerErrorHandler(): Promise<void> {
    let extension = 'js'

    if (Env('NODE_TS') === 'true') {
      extension = 'ts'
    }

    const path = Path.app(`Console/Exceptions/Handler.${extension}`)

    const Handler = resolveModule(await import(path))
    const handler = new Handler()

    Artisan.setErrorHandler(handler.handle.bind(handler))
  }
}
