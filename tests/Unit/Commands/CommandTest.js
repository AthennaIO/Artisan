/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { Command } from '#src/Commands/Command'
import { NotImplementedHandleException } from '#src/Exceptions/NotImplementedHandleException'
import { NotImplementedSignatureException } from '#src/Exceptions/NotImplementedSignatureException'

test.group('CommandTest', group => {
  /** @type {import('#src/index').Command} */
  const command = new Command()

  test('should throw not implemented handle exception', async ({ assert }) => {
    assert.throws(() => command.handle(), NotImplementedHandleException)
  })

  test('should throw not implemented signature exception', async ({ assert }) => {
    assert.throws(() => command.signature, NotImplementedSignatureException)
  })

  test('should be able to create tables', async ({ assert }) => {
    const table = command.createTable({}, ['1', '2'], ['hello', 'world'])

    assert.isTrue(table.includes('1'))
    assert.isTrue(table.includes('2'))
    assert.isTrue(table.includes('hello'))
    assert.isTrue(table.includes('world'))
  })

  test('should be able to create columns', async ({ assert }) => {
    const data = [{ name: 'athenna', version: 'v1.0.0', description: 'A nice project!' }]

    const column = command.createColumn(data, { columns: ['name', 'version'] })

    assert.isTrue(column.includes('NAME'))
    assert.isTrue(column.includes('VERSION'))
    assert.isTrue(column.includes('athenna'))
    assert.isTrue(column.includes('v1.0.0'))
  })

  test('should be able to create big rainbow strings', async ({ assert }) => {
    const bigRainbowString = command.createRainbow('Athenna')

    assert.isTrue(bigRainbowString.includes('_'))
    assert.isTrue(bigRainbowString.includes('|'))
  })
})
