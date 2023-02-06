/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import CliTable from 'cli-table3'

import { Color } from '@athenna/common'
import { TableRow } from '#src/Types/TableRow'

export class Table {
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
   * Render the table.
   */
  public render(opts?: CliTable.TableConstructorOptions): void {
    const cliTable = new CliTable({
      head: this.state.head,
      style: { head: [], border: ['dim'] },
      ...opts,
    })

    this.state.rows.forEach(row => cliTable.push(row))
    process.stdout.write(Color.apply(cliTable.toString()).concat('\n'))
  }
}
