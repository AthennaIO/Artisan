/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { isAbsolute, resolve } from 'node:path'
import { Exec, File, Is, Module } from '@athenna/common'
import { Artisan, CommanderHandler, ConsoleExceptionHandler } from '#src'

export class ConsoleKernel {
  /**
   * Register all the commands found inside "rc.commands" config inside
   * the service provider and also register it in Commander.
   */
  public async registerCommands(argv: string[] = []) {
    const commandName = argv[2]

    if (commandName === undefined) {
      return this.registerAllCommands()
    }

    const command = Config.get(`rc.commands.${commandName}`)

    /**
     * If the command is not inside "rc.commands", then it
     * means that is registered using route file or does not exist.
     *
     * Commander does not throw errors when a command does not exist
     * and there are any command registered in the application. To
     * avoid this behavior we are going to register all commands of
     * "rc.commands" when the command is using route file or does not
     * exist.
     */
    if (!command) {
      return this.registerAllCommands()
    }

    const path = command.path || command

    if (command.loadAllCommands) {
      return this.registerAllCommands()
    }

    return this.registerCommandByPath(path)
  }

  /**
   * Register the route commands by importing the file. Artisan is the only
   * type of service that loads the route file without using the "rc.preloads" property.
   * This behavior was implemented because of the command settings. To load the preloads
   * files, Artisan would need to bootstrap the Athenna application.
   */
  public async registerRouteCommands(path: string) {
    if (path.startsWith('#')) {
      await this.resolvePath(path)

      return
    }

    if (!isAbsolute(path)) {
      path = resolve(path)
    }

    if (!(await File.exists(path))) {
      return
    }

    await this.resolvePath(path)
  }

  /**
   * Register the exception handler for all Artisan commands.
   */
  public async registerExceptionHandler(path?: string) {
    if (!path) {
      const handler = new ConsoleExceptionHandler()

      CommanderHandler.setExceptionHandler(handler.handle.bind(handler))

      return
    }

    const Handler = await this.resolvePath(path)
    const handler = new Handler()

    CommanderHandler.setExceptionHandler(handler.handle.bind(handler))
  }

  /**
   * Register a command by the path. This method will register the
   * command inside the service provider and also in Artisan.
   */
  public async registerCommandByPath(path: string): Promise<void> {
    const Command = await this.resolvePath(path)

    Artisan.register(new Command())
  }

  /**
   * Resolve the import path by meta URL and import it.
   */
  private async resolvePath(path: string) {
    return Module.resolve(
      `${path}?version=${Math.random()}`,
      Config.get('rc.meta')
    )
  }

  /**
   * Register all commands inside "rc.commands" object.
   */
  private async registerAllCommands() {
    const keys = Object.keys(Config.get('rc.commands', {}))

    return Exec.concurrently(keys, key => {
      const path = Config.get(`rc.commands.${key}`)

      if (Is.String(path)) {
        return this.registerCommandByPath(path)
      }

      return this.registerCommandByPath(path.path)
    })
  }
}
