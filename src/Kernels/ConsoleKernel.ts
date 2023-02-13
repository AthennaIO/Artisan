/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { resolve } from 'node:path'
import { Artisan } from '#src/Facades/Artisan'
import { File, String, Module } from '@athenna/common'
import { CommanderHandler } from '#src/Handlers/CommanderHandler'

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
    if (!(await File.exists(path))) {
      return
    }

    await import(path)
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
        `ConsoleExceptionHandler.${Path.ext()}`,
      )
    }

    const Handler = await Module.getFrom(path)
    const handler = new Handler()

    CommanderHandler.setExceptionHandler(handler.handle.bind(handler))
  }

  /**
   * Register a command by the path. This method will register the
   * command inside the service provider and also in Artisan.
   */
  public async registerCommandByPath(path: string): Promise<void> {
    if (!path.startsWith('#')) {
      path = resolve(path)
    }

    const { module, alias } = await Module.getWithAlias(
      await import(path),
      'App/Console/Commands',
    )

    const createCamelAlias = true
    const camelTargetName = String.toCamelCase(module.name)

    if (ioc.hasDependency(alias) || ioc.hasDependency(camelTargetName)) {
      return
    }

    const command = ioc
      .singleton(alias, module, createCamelAlias)
      .safeUse(alias)

    Artisan.register(command)
  }
}
