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
import { Sticker } from '#src/Helpers/Sticker'

test.group('StickerTest', () => {
  test('should be able to create stickers', async ({ assert }) => {
    const sticker = new Sticker()
      .head('Project created')
      .add(`cd ${Color.cyan('hello-world')}`)
      .toString()

    assert.equal(
      Color.removeColors(sticker),
      '╭─────────────────────────╮\n' +
        '│     Project created     │\n' +
        '├─────────────────────────┤\n' +
        '│                         │\n' +
        '│     cd hello-world      │\n' +
        '│                         │\n' +
        '╰─────────────────────────╯',
    )
  })
})
