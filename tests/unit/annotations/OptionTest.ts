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
import { OPTIONS_KEY } from '#src/constants/MetadataKeys'

export default class OptionTest extends BaseTest {
  @Test()
  public async shouldBeAbleToPreregisterOptionsInACommandUsingOptionAnnotation({ assert }: Context) {
    const { annotatedCommand } = await this.import('#tests/fixtures/AnnotatedCommand')

    const opts = Reflect.getMetadata(OPTIONS_KEY, annotatedCommand)

    assert.deepEqual(opts[0], { key: 'withName', isGlobal: false, signature: '--with-name', signatureName: 'withName' })
    assert.deepEqual(opts[1], {
      key: 'withAge',
      isGlobal: false,
      signature: '--with-age',
      signatureName: 'withAge',
      description: 'Add the age of the person'
    })
    assert.deepEqual(opts[2], {
      default: true,
      isGlobal: false,
      key: 'withEmail',
      signatureName: 'addEmail',
      signature: '-am, --add-email',
      description: 'Add the email of the person'
    })
    assert.deepEqual(opts[3], {
      key: 'withFoo',
      isGlobal: false,
      default: false,
      signature: '--no-foo',
      signatureName: 'foo'
    })
  }
}
