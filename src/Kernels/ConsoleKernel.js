/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { pathToFileURL } from 'node:url'
import { Exec, Path } from '@secjs/utils'

import { Artisan } from '#src/index'

export class ConsoleKernel {
  /**
   * Register the commands for the application.
   *
   * @type {import('#src/index').Command[] | Promise<any>}
   */
  commands

  /**
   * Register all the commands to the artisan.
   *
   * @return {Promise<void>}
   */
  async registerCommands() {
    for (const module of this.commands) {
      let Command = await Exec.getModule(module)

      const alias = `App/Console/Commands/${Command.name}`

      Command = ioc.bind(alias, Command).safeUse(alias)

      /**
       * Action runner catches all exceptions thrown by commands
       * exceptions and sends to the Artisan exception handler.
       *
       * @param {any} fn
       */
      const actionRunner = fn => {
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
   * @return {Promise<void>}
   */
  async registerErrorHandler() {
    const path = Path.console('Exceptions/Handler.js')

    const Handler = await Exec.getModule(import(pathToFileURL(path).href))
    const handler = new Handler()

    Artisan.setErrorHandler(handler.handle.bind(handler))
  }
}
