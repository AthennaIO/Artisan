/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { existsSync } from 'fs'
import { Path, String } from '@secjs/utils'
import { Command } from 'src/Commands/Command'
import { Commander } from 'src/Contracts/Commander'
import { FacadeNotFoundException } from 'src/Exceptions/FacadeNotFoundException'
import { FileNotFoundException } from 'src/Exceptions/FileNotFoundException'

export class List extends Command {
  /**
   * The name and signature of the console command.
   */
  protected signature = 'route:list'

  /**
   * The console command description.
   */
  protected description = 'List all the routes of your application.'

  /**
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @return {void}
   */
  public addFlags(commander: Commander): Commander {
    return commander.option(
      '-m, --middleware',
      'List the middlewares of each route.',
      false,
    )
  }

  /**
   * Execute the console command.
   *
   * @return {Promise<void>}
   */
  async handle(options: any): Promise<void> {
    this.simpleLog('[ ROUTE LISTING ]', 'rmNewLineStart', 'bold', 'green')

    const Route = ioc.use<any>('Athenna/Core/HttpRoute')

    if (!Route) {
      throw new FacadeNotFoundException('Route')
    }

    const routePath = Path.pwd('dist/routes/http.js')

    if (!existsSync(routePath)) {
      throw new FileNotFoundException('dist/routes/http.js')
    }

    await import(routePath)
    const routes = Route.listRoutes()

    const header = ['Method', 'Route', 'Handler']
    const rows: any[] = []

    if (options.middleware) header.push('Middlewares')

    routes.forEach(route => {
      const row = [route.methods.join('|'), route.url, 'Closure']

      if (options.middleware) {
        let middlewares = ''

        Object.keys(route.middlewares).forEach(key => {
          if (route.middlewares[key].length) {
            const number = route.middlewares[key].length

            if (middlewares) {
              middlewares = middlewares + '\n'
            }

            middlewares = middlewares + `${String.toPascalCase(key)}: ${number}`
          }
        })

        if (!middlewares) middlewares = 'Not found'

        row.push(middlewares)
      }

      rows.push(row)
    })

    this.logTable({ head: header }, ...rows)
  }
}
