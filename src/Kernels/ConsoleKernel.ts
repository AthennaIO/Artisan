/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { File, Module } from '@athenna/common'
import { Artisan, CommanderHandler } from '#src'

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

    const paths = Config.get<string[]>('rc.commands')
    const promises = paths.map(path => this.registerCommandByPath(path))

    await Promise.all(promises)
  }

  /**
   * Register the route commands by importing the file. Artisan is the only
   * type of service that loads the route file without using the "rc.preloads" property.
   * This behavior was implemented because of the command settings. To load the preloads
   * files, Artisan would need to bootstrap the Athenna application.
   */
  public async registerRouteCommands(path: string) {
    if (path.includes('./') || path.includes('../')) {
      path = resolve(path)
    }

    if (!(await File.exists(path))) {
      return
    }

    await this.resolvePathAndImport(path)
  }

  /**
   * Register the exception handler for all Artisan commands.
   */
  public async registerExceptionHandler(path?: string) {
    if (!path) {
      path = resolve(
        Module.createDirname(import.meta.url),
        '..',
        'Handlers',
        `ConsoleExceptionHandler.js`,
      )
    }

    const Handler = await this.resolvePathAndImport(path)
    const handler = new Handler()

    CommanderHandler.setExceptionHandler(handler.handle.bind(handler))
  }

  /**
   * Register a command by the path. This method will register the
   * command inside the service provider and also in Artisan.
   */
  public async registerCommandByPath(path: string): Promise<void> {
    const Command = await this.resolvePathAndImport(path)

    Artisan.register(new Command())
  }

  /**
   * Resolve the import path by meta URL and import it.
   */
  private resolvePathAndImport(path: string) {
    if (path.includes('./') || path.includes('../')) {
      path = resolve(path)
    }

    if (!path.startsWith('#')) {
      path = pathToFileURL(path).href
    }

    return import.meta
      .resolve(path, Config.get('rc.meta'))
      .then(meta => Module.get(import(meta)))
  }
}
