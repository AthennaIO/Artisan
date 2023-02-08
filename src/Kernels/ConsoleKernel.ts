/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { resolve } from 'node:path'
import { Module } from '@athenna/common'
import { Artisan } from '#src/Facades/Artisan'
import { CommanderHandler } from '#src/Handlers/CommanderHandler'

export class ConsoleKernel {
  /**
   * Register all the commands found inside "rc.commands" config inside
   * the service provider and also register it in Commander.
   */
  async registerCommands(argv: string[] = []) {
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
   * Register the exception handler for all Artisan commands.
   */
  async registerExceptionHandler(path?: string) {
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
  public async registerCommandByPath(path: string) {
    if (!path.startsWith('#')) {
      path = resolve(path)
    }

    const { module, alias } = await Module.getWithAlias(
      await import(path),
      'App/Console/Commands',
    )

    const command = ioc.singleton(alias, module).safeUse(alias)

    Artisan.register(command)
  }
}
