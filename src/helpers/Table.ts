/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import CliTable from 'cli-table3'

import { Log } from '@athenna/logger'
import { Color, Macroable } from '@athenna/common'
import type { TableRow } from '#src/types/TableRow'

export class Table extends Macroable {
  /**
   * The state of the table. This property will
   * have the head and rows of your table.
   */
  public state = { head: [], rows: [] }

  /**
   * Define table headers.
   */
  public head(...headers: string[]): Table {
    headers.forEach(col => this.state.head.push(Color.purple(col)))

    return this
  }

  /**
   * Define table rows.
   */
  public row(...rows: TableRow[]): Table {
    rows.forEach(col => this.state.rows.push(col))

    return this
  }

  /**
   * Create the table and return as string.
   */
  public toString(opts?: CliTable.TableConstructorOptions): string {
    const cliTable = new CliTable({
      head: this.state.head,
      style: { head: [], border: ['dim'] },
      ...opts
    })

    this.state.rows.forEach(row => cliTable.push(row))

    return cliTable.toString()
  }

  /**
   * Create the table string and render it.
   */
  public render(opts?: CliTable.TableConstructorOptions): void {
    return this.log(this.toString(opts))
  }

  /**
   * Simple vanilla logger implementation to work the same way
   * of Artisan logger.
   */
  private log(...args: any[]) {
    const level = Config.get('logging.channels.console.trace', 'trace')
    const driver = Config.get('logging.channels.console.driver', 'console')

    return Log.standalone({ level, driver }).success(...args)
  }
}
