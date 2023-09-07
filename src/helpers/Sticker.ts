/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import boxes from 'cli-boxes'
import CliTable3 from 'cli-table3'

import { Table } from '#src/helpers/Table'

export class Sticker {
  /**
   * The head of the instruction.
   */
  private _head: string

  /**
   * The one-line rows of the instruction.
   */
  private _rows: string

  /**
   * Set a head in the sticker.
   *
   * @example
   * ```ts
   * this.logger.sticker()
   *    .head('Project Created')
   *    .add(`cd ${this.colors.cyan('hello-world')}`)
   *    .add(`Run ${this.colors.cyan('node artisan serve --watch')} to start the server`)
   *    .render()
   * ```
   * Output:
   * ```bash
   * ╭──────────────────────────────────────────────────────────╮
   * │    Project Created                                       │
   * │──────────────────────────────────────────────────────────│
   * │                                                          │
   * │    cd hello-world                                        │
   * │    Run node artisan serve --watch to start the server    │
   * │                                                          │
   * ╰──────────────────────────────────────────────────────────╯
   * ```
   */
  public head(head: string): Sticker {
    this._head = `    ${head}    `

    return this
  }

  /**
   * Set a row in the sticker.
   *
   * @example
   * ```ts
   * this.logger.sticker()
   *    .add(`cd ${this.colors.cyan('hello-world')}`)
   *    .add(`Run ${this.colors.cyan('node artisan serve --watch')} to start the server`)
   *    .render()
   * ```
   * Output:
   * ```bash
   * ╭──────────────────────────────────────────────────────────╮
   * │                                                          │
   * │    cd hello-world                                        │
   * │    Run node artisan serve --watch to start the server    │
   * │                                                          │
   * ╰──────────────────────────────────────────────────────────╯
   * ```
   */
  public add(row: string): Sticker {
    if (!this._rows) {
      this._rows = '\n'
    }

    if (row === '') {
      this._rows = this._rows.concat('\n')

      return this
    }

    this._rows = this._rows.concat(`    ${row}    \n`)

    return this
  }

  /**
   * Create the sticker and return as string.
   */
  public toString(opts?: CliTable3.TableConstructorOptions): string {
    const table = new Table()

    if (this._head) {
      table.head(this._head)
    }

    return table.row([this._rows]).toString({
      chars: boxes.round,
      ...opts
    })
  }

  /**
   * Render the sticker in the console.
   *
   * @example
   * ```ts
   * this.logger.sticker()
   *    .add(`cd ${this.colors.cyan('hello-world')}`)
   *    .add(`Run ${this.colors.cyan('node artisan serve --watch')} to start the server`)
   *    .render()
   * ```
   * Output:
   * ```bash
   * ╭──────────────────────────────────────────────────────────╮
   * │                                                          │
   * │    cd hello-world                                        │
   * │    Run node artisan serve --watch to start the server    │
   * │                                                          │
   * ╰──────────────────────────────────────────────────────────╯
   * ```
   */
  public render(opts?: CliTable3.TableConstructorOptions): void {
    const table = new Table()

    if (this._head) {
      table.head(this._head)
    }

    return table.row([this._rows]).render({
      chars: boxes.round,
      ...opts
    })
  }
}
