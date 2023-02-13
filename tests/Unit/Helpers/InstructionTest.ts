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
import { Instruction } from '#src/Helpers/Instruction'

test.group('InstructionTest', () => {
  test('should be able to create instructions', async ({ assert }) => {
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
  })
})
