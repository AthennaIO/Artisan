/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exec, File, Module } from '@athenna/common'
import { Artisan, CommanderHandler, ConsoleExceptionHandler } from '#src'

export class ConsoleKernel {
  /**
   * Register all the commands found inside "rc.commands" config inside
   * the service provider and also register it in Commander.
   */
  public async registerCommands(argv: string[] = []) {
    const commandName = argv[2]
    const path = Config.get(`rc.commandsManifest.${commandName}`)

    if (path) {
      return this.registerCommandByPath(path)
    }

    await Exec.concurrently(
      Config.get('rc.commands'),
      this.registerCommandByPath,
    )
  }

  /**
   * Register the route commands by importing the file. Artisan is the only
   * type of service that loads the route file without using the "rc.preloads" property.
   * This behavior was implemented because of the command settings. To load the preloads
   * files, Artisan would need to bootstrap the Athenna application.
   */
  public async registerRouteCommands(path: string) {
    if (path.startsWith('#')) {
      await Module.resolve(path, Config.get('rc.meta'))

      return
    }

    if (!(await File.exists(path))) {
      return
    }

    await Module.resolve(path, Config.get('rc.meta'))
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

    const Handler = await Module.resolve(path, Config.get('rc.meta'))
    const handler = new Handler()

    CommanderHandler.setExceptionHandler(handler.handle.bind(handler))
  }

  /**
   * Register a command by the path. This method will register the
   * command inside the service provider and also in Artisan.
   */
  public async registerCommandByPath(path: string): Promise<void> {
    const Command = await Module.resolve(path, Config.get('rc.meta'))

    Artisan.register(new Command())
  }
}
