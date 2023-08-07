/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Test } from '@athenna/test'
import { Color } from '@athenna/common'
import { Table } from '#src/helpers/Table'
import type { Context } from '@athenna/test/types'

export default class TableTest {
  @Test()
  public async shouldBeAbleToCreateTables({ assert }: Context) {
    const table = new Table().head('hello', 'world').row(['hello', 'world']).toString()

    assert.equal(
      Color.removeColors(table),
      '┌───────┬───────┐\n' +
        `│ hello │ world │\n` +
        '├───────┼───────┤\n' +
        '│ hello │ world │\n' +
        '└───────┴───────┘',
    )
  }
}
