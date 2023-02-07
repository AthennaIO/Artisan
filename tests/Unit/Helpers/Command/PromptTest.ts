/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import inquirer from 'inquirer'

import { test } from '@japa/runner'
import { Prompt } from '#src/Helpers/Command/Prompt'
import { InquirerPromptException } from '#src/Exceptions/InquirerPromptException'

test.group('PromptTest', group => {
  const prompt = new Prompt()

  group.setup(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    prompt.inquirer = _ => Promise.resolve({ raw: 'value' })
  })

  group.teardown(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    prompt.inquirer = inquirer.createPromptModule()
  })

  test('should be able to prompt inputs', async ({ assert }) => {
    const value = await prompt.input('What is the value?')

    assert.equal(value, 'value')
  })

  test('should be able to prompt secrets', async ({ assert }) => {
    const value = await prompt.secret('What is the value?')

    assert.equal(value, 'value')
  })

  test('should be able to prompt confirm', async ({ assert }) => {
    const value = await prompt.confirm('What is the value?')

    assert.equal(value, 'value')
  })

  test('should be able to prompt editor', async ({ assert }) => {
    const value = await prompt.editor('What is the value?')

    assert.equal(value, 'value')
  })

  test('should be able to prompt list', async ({ assert }) => {
    const value = await prompt.list('What is the value?', ['value', 'other value'])

    assert.equal(value, 'value')
  })

  test('should be able to prompt expand', async ({ assert }) => {
    const value = await prompt.expand('What is the value?', [{ name: 'value', key: 'value' }])

    assert.equal(value, 'value')
  })

  test('should be able to prompt checkbox', async ({ assert }) => {
    const value = await prompt.checkbox('What is the value?', ['value', 'other value'])

    assert.equal(value, 'value')
  })

  test('should throw inquirer prompt error when some error happens calling raw method', async ({ assert }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    prompt.inquirer = _ => Promise.reject(new Error('value'))

    await assert.rejects(() => prompt.raw('What is the value?', { type: 'input' }), InquirerPromptException)
  })
})
