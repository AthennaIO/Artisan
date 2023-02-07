/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Color } from '@athenna/common'
import { Table } from '#src/Helpers/Table'

test.group('TableTest', () => {
  test('should be able to create tables', async ({ assert }) => {
    const table = new Table().head('hello', 'world').row(['hello', 'world']).toString()

    assert.equal(
      Color.removeColors(table),
      '┌───────┬───────┐\n' +
        `│ hello │ world │\n` +
        '├───────┼───────┤\n' +
        '│ hello │ world │\n' +
        '└───────┴───────┘',
    )
  })
})
