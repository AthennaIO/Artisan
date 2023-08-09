/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Color } from '@athenna/common'
import { Test, type Context } from '@athenna/test'
import { Instruction } from '#src/helpers/Instruction'

export default class InstructionTest {
  @Test()
  public async shouldBeAbleToCreateInstructions({ assert }: Context) {
    const instruction = new Instruction().head('Project created').add('cd hello-world').toString()

    assert.equal(
      Color.removeColors(instruction),
      '╭──────────────────────────╮\n' +
        '│     Project created      │\n' +
        '├──────────────────────────┤\n' +
        '│                          │\n' +
        '│     ❯ cd hello-world     │\n' +
        '│                          │\n' +
        '╰──────────────────────────╯',
    )
  }

  @Test()
  public async shouldBeAbleToSetNewLinesOnInstructionsRows({ assert }: Context) {
    const instruction = new Instruction()
      .head('Project created')
      .add('cd hello-world')
      .add('')
      .add('npm run start')
      .toString()

    assert.equal(
      Color.removeColors(instruction),
      '╭──────────────────────────╮\n' +
        '│     Project created      │\n' +
        '├──────────────────────────┤\n' +
        '│                          │\n' +
        '│     ❯ cd hello-world     │\n' +
        '│                          │\n' +
        '│     ❯ npm run start      │\n' +
        '│                          │\n' +
        '╰──────────────────────────╯',
    )
  }
}
