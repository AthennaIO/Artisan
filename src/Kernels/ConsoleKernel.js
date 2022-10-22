/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Module, Path } from '@athenna/common'

import { Artisan, ArtisanLoader, Template } from '#src/index'

export class ConsoleKernel {
  /**
   * Register the commands for the application.
   *
   * @return {import('#src/index').Command[] | Promise<any[]>}
   */
  get commands() {
    return [...ArtisanLoader.loadCommands()]
  }

  /**
   * Register custom templates files.
   *
   * @return {import('@athenna/common').File[] | Promise<any[]>}
   */
  get templates() {
    return [...ArtisanLoader.loadTemplates()]
  }

  /**
   * Register all the commands to the artisan.
   *
   * @return {Promise<void>}
   */
  async registerCommands() {
    const commands = await Module.getAllWithAlias(
      this.commands,
      'App/Console/Commands',
    )

    /**
     * Action runner catches all exceptions thrown by commands
     * exceptions and sends to the Artisan exception handler.
     *
     * @param {any} fn
     */
    const actionRunner = fn => {
      return (...args) => fn(...args).catch(Artisan.getErrorHandler())
    }

    commands.forEach(({ alias, module }) => {
      const Command = ioc.bind(alias, module).safeUse(alias)

      Artisan.register(commander => {
        commander = commander
          .command(Command.signature)
          .description(Command.description)

        Command.addFlags(commander)
          .action(actionRunner(Command.handle.bind(Command)))
          .showHelpAfterError()
          .createHelp()
      })
    })
  }

  /**
   * Register the default error handler.
   *
   * @return {Promise<void>}
   */
  async registerErrorHandler() {
    const Handler = await Module.getFrom(Path.console('Exceptions/Handler.js'))

    const handler = new Handler()

    Artisan.setErrorHandler(handler.handle.bind(handler))
  }

  /**
   * Register the custom templates on template helper.
   *
   * @return {Promise<void>}
   */
  async registerTemplates() {
    Template.addTemplatesFiles(this.templates)
  }
}
