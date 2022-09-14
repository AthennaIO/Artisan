/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Path } from '@secjs/utils'
import { TemplateHelper } from '#src/index'
import { NotFoundTemplateException } from '#src/Exceptions/NotFoundTemplateException'

test.group('TemplateHelperTest', group => {
  test('should be able to add templates to template helper', async ({ assert }) => {
    TemplateHelper.addTemplates(Path.stubs('templates'))

    assert.isTrue(TemplateHelper.hasTemplate('command'))
  })

  test('should be able to remove templates from template helper', async ({ assert }) => {
    TemplateHelper.removeTemplates('command')

    assert.isFalse(TemplateHelper.hasTemplate('command'))
  })

  test('should not throw any exception when removing a template that does not exist', async ({ assert }) => {
    assert.doesNotThrows(() => TemplateHelper.removeTemplate('command'))
  })

  test('should throw a not found template exception when trying to get a template', async ({ assert }) => {
    assert.throws(() => TemplateHelper.getTemplate('not-found'), NotFoundTemplateException)
  })
})
