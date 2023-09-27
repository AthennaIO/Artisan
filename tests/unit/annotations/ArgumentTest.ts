/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Test, type Context } from '@athenna/test'
import { BaseTest } from '#tests/helpers/BaseTest'
import { ARGUMENTS_KEY } from '#src/constants/MetadataKeys'

export default class ArgumentTest extends BaseTest {
  @Test()
  public async shouldBeAbleToPreregisterArgumentsInACommandUsingArgumentAnnotation({ assert }: Context) {
    const { annotatedCommand } = await this.import('#tests/fixtures/AnnotatedCommand')

    const args = Reflect.getMetadata(ARGUMENTS_KEY, annotatedCommand)

    assert.deepEqual(args[0], { key: 'name', required: true, signature: '<name>', signatureName: 'name' })
    assert.deepEqual(args[1], {
      key: 'age',
      required: true,
      signature: '<age>',
      signatureName: 'age',
      description: 'The age of the person'
    })
    assert.deepEqual(args[2], {
      key: 'email',
      required: false,
      signature: '[your-email]',
      signatureName: 'your-email',
      default: 'lenon@athenna.io',
      description: 'The email of the person'
    })
  }
}
