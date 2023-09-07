/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Color } from '@athenna/common'
import { Sticker } from '#src/helpers/Sticker'
import { Test, type Context } from '@athenna/test'

export default class StickerTest {
  @Test()
  public async shouldBeAbleToCreateStickers({ assert }: Context) {
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
        '╰─────────────────────────╯'
    )
  }

  @Test()
  public async shouldBeAbleToSetNewLinesOnStickerRows({ assert }: Context) {
    const sticker = new Sticker()
      .head('Project created')
      .add(`cd ${Color.cyan('hello-world')}`)
      .add('')
      .add(`npm run ${Color.cyan('start')}`)
      .toString()

    assert.equal(
      Color.removeColors(sticker),
      '╭─────────────────────────╮\n' +
        '│     Project created     │\n' +
        '├─────────────────────────┤\n' +
        '│                         │\n' +
        '│     cd hello-world      │\n' +
        '│                         │\n' +
        '│     npm run start       │\n' +
        '│                         │\n' +
        '╰─────────────────────────╯'
    )
  }
}
