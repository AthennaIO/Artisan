/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Path } from '@athenna/common'
import { Template } from '#src/index'
import { TemplateProvider } from '#src/Providers/TemplateProvider'
import { NotFoundTemplateException } from '#src/Exceptions/NotFoundTemplateException'

test.group('TemplateHelperTest', group => {
  group.each.setup(() => {
    new TemplateProvider().register()
  })

  test('should be able to add templates to template helper', async ({ assert }) => {
    Template.addTemplates(Path.stubs('templates'))

    assert.isTrue(Template.hasTemplate('command'))
  })

  test('should be able to remove templates from template helper', async ({ assert }) => {
    Template.removeTemplates('command')

    assert.isFalse(Template.hasTemplate('command'))
  })

  test('should not throw any exception when removing a template that does not exist', async ({ assert }) => {
    assert.doesNotThrows(() => Template.removeTemplate('command'))
  })

  test('should throw a not found template exception when trying to get a template', async ({ assert }) => {
    assert.throws(() => Template.getTemplate('not-found'), NotFoundTemplateException)
  })
})
