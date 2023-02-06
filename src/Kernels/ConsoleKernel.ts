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
  async registerCommands() {
    const modules = Config.get<string[]>('rc.commands').map(c => import(c))
    const commands = await Module.getAllWithAlias(
      modules,
      'App/Console/Commands',
    )

    commands.forEach(({ alias, module }) => {
      const command = ioc.singleton(alias, module).safeUse(alias)

      Artisan.register(command)
    })
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
}
