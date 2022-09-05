/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { File, Path } from '@secjs/utils'
import { FilePropertiesHelper } from '#src/Helpers/FilePropertiesHelper'

test.group('FilePropertiesHelperTest', group => {
  group.each.setup(async () => {
    await new File(Path.stubs('replaceFile.js')).copy(Path.stubs('replaceFileCopy.js'))
  })

  group.each.teardown(async () => {
    await File.safeRemove(Path.stubs('replaceFileCopy.js'))
  })

  test('should be able to add content to functions properties in files', async ({ assert }) => {
    const file = await FilePropertiesHelper.addContentToFunctionProperty(
      Path.stubs('replaceFileCopy.js'),
      'internalCommands.push',
      "'hello'",
    )

    const content = file.getContentSync().toString()

    assert.isTrue(
      content.includes(
        "internalCommands.push(...ArtisanLoader.loadCommands,'oi','zap','truc','dale','vtnc','zsadsadasdasdas','dsaldksaldksaldkasld','hello')",
      ),
    )
  }).pin()

  test('should be able to add content to array properties in files', async ({ assert }) => {
    const file = await FilePropertiesHelper.addContentToArrayProperty(
      Path.stubs('replaceFileCopy.js'),
      'const internalCommands = ',
      "'hello'",
    )

    const content = file.getContentSync().toString()

    assert.isTrue(content.includes("const internalCommands = ['hello'"))
  }).pin()

  test('should be able to add content to object properties in files', async ({ assert }) => {
    const file = await FilePropertiesHelper.addContentToObjectProperty(
      Path.stubs('replaceFileCopy.js'),
      'const object = ',
      "nice: 'hello'",
    )

    const content = file.getContentSync().toString()

    assert.isTrue(content.includes("const object = {nice: 'hello'}"))
  }).pin()
})
