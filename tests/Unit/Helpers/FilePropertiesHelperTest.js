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
        "internalCommands.push(...ArtisanLoader.loadCommands,'dasdada','dsadsad','dsadsaa','dswesas','ewqasdw','aqwerfs','dswpoik','lklopls','ieumjhg','hello')",
      ),
    )
  })

  test('should not add content to functions properties because does not match', async ({ assert }) => {
    const file = await FilePropertiesHelper.addContentToFunctionProperty(
      Path.stubs('replaceFileCopy.js'),
      'internalCommands.pushh',
      "'hello'",
    )

    const content = file.getContentSync().toString()

    assert.isFalse(
      content.includes(
        "internalCommands.push(...ArtisanLoader.loadCommands,'dasdada','dsadsad','dsadsaa','dswesas','ewqasdw','aqwerfs','dswpoik','lklopls','ieumjhg','hello')",
      ),
    )
  })

  test('should be able to add content to array properties in files', async ({ assert }) => {
    const file = await FilePropertiesHelper.addContentToArrayProperty(
      Path.stubs('replaceFileCopy.js'),
      'const internalCommands = ',
      "'hello'",
    )

    const content = file.getContentSync().toString()

    assert.isTrue(
      content.includes(
        "const internalCommands = ['dasdada','dsadsad','dsadsaa','dswesas','ewqasdw','aqwerfs','dswpoik','lklopls','ieumjhg','hello']",
      ),
    )
  })

  test('should not add content to array properties because does not match', async ({ assert }) => {
    const file = await FilePropertiesHelper.addContentToArrayProperty(
      Path.stubs('replaceFileCopy.js'),
      'const internalCommandss = ',
      "'hello'",
    )

    const content = file.getContentSync().toString()

    assert.isFalse(
      content.includes(
        "const internalCommands = ['dasdada','dsadsad','dsadsaa','dswesas','ewqasdw','aqwerfs','dswpoik','lklopls','ieumjhg','hello']",
      ),
    )
  })

  test('should be able to add content to object properties in files', async ({ assert }) => {
    const file = await FilePropertiesHelper.addContentToObjectProperty(
      Path.stubs('replaceFileCopy.js'),
      'const object = ',
      "nice: 'hello'",
    )

    const content = file.getContentSync().toString()

    assert.isTrue(
      content.includes(
        "const object = {dasdada:'dasdada',dsadsad:'dsadsad',dsadsaa:'dsadsaa',dswesas:'dswesas',ewqasdw:'ewqasdw',aqwerfs:'aqwerfs',dswpoik:'dswpoik',lklopls:'lklopls',ieumjhg:'ieumjhg',nice: 'hello'}",
      ),
    )
  })

  test('should not add content to object properties because does not match', async ({ assert }) => {
    const file = await FilePropertiesHelper.addContentToObjectProperty(
      Path.stubs('replaceFileCopy.js'),
      'const objectt = ',
      "nice: 'hello'",
    )

    const content = file.getContentSync().toString()

    assert.isFalse(
      content.includes(
        "const object = {dasdada:'dasdada',dsadsad:'dsadsad',dsadsaa:'dsadsaa',dswesas:'dswesas',ewqasdw:'ewqasdw',aqwerfs:'aqwerfs',dswpoik:'dswpoik',lklopls:'lklopls',ieumjhg:'ieumjhg',nice: 'hello'}",
      ),
    )
  })

  test('should be able to add content to array getter in files', async ({ assert }) => {
    const file = await FilePropertiesHelper.addContentToArrayGetter(
      Path.stubs('replaceFileCopy.js'),
      'templates',
      "'hello'",
    )

    const content = file.getContentSync().toString()

    assert.isTrue(content.includes('get templates() {\n' + " return ['hello']\n" + '  }'))
  })

  test('should not add content to array getter because does not match', async ({ assert }) => {
    const file = await FilePropertiesHelper.addContentToArrayGetter(
      Path.stubs('replaceFileCopy.js'),
      'templatess',
      "'hello'",
    )

    const content = file.getContentSync().toString()

    assert.isFalse(content.includes('get templates() {\n' + " return ['hello']\n" + '  }'))
  })

  test('should be able to add content to object getter in files', async ({ assert }) => {
    const file = await FilePropertiesHelper.addContentToObjectGetter(
      Path.stubs('replaceFileCopy.js'),
      'getterObj',
      "nice: 'hello'",
    )

    const content = file.getContentSync().toString()

    assert.isTrue(content.includes('get getterObj() {\n' + " return {nice: 'hello'}\n" + '  }'))
  })

  test('should not add content to object getter because does not match', async ({ assert }) => {
    const file = await FilePropertiesHelper.addContentToObjectGetter(
      Path.stubs('replaceFileCopy.js'),
      'getterObjj',
      "nice: 'hello'",
    )

    const content = file.getContentSync().toString()

    assert.isFalse(content.includes('get getterObj() {\n' + " return {nice: 'hello'}\n" + '  }'))
  })
})
