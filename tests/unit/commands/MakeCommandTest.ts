/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { File, Path } from '@athenna/common'
import { BaseTest } from '#tests/helpers/BaseTest'
import { Test, type Context } from '@athenna/test'

export default class MakeCommandTest extends BaseTest {
  @Test()
  public async shouldBeAbleToCreateACommandFile({ assert, command }: Context) {
    const output = await command.run('make:command TestCommand')

    output.assertSucceeded()
    output.assertLogged('[ MAKING COMMAND ]')
    output.assertLogged('[  success  ] Command "TestCommand" successfully created.')
    output.assertLogged(
      '[  success  ] Athenna RC updated: { commands += "testCommand": "#app/console/commands/TestCommand" }'
    )

    const { athenna } = await new File(Path.pwd('package.json')).getContentAsJson()

    assert.isTrue(await File.exists(Path.commands('TestCommand.ts')))
    assert.containsSubset(athenna.commands, {
      testCommand: '#app/console/commands/TestCommand'
    })
  }

  @Test()
  public async shouldBeAbleToCreateACommandFileWithADifferentDestPathAndImportPath({ assert, command }: Context) {
    const output = await command.run('make:command TestCommand', {
      path: Path.fixtures('consoles/console-mock-dest-import.ts')
    })

    output.assertSucceeded()
    output.assertLogged('[ MAKING COMMAND ]')
    output.assertLogged('[  success  ] Command "TestCommand" successfully created.')
    output.assertLogged(
      '[  success  ] Athenna RC updated: { commands += "testCommand": "#tests/fixtures/storage/commands/TestCommand" }'
    )

    const { athenna } = await new File(Path.pwd('package.json')).getContentAsJson()

    assert.isTrue(await File.exists(Path.fixtures('storage/commands/TestCommand.ts')))
    assert.containsSubset(athenna.commands, {
      testCommand: '#tests/fixtures/storage/commands/TestCommand'
    })
  }

  @Test()
  public async shouldThrowAnExceptionWhenTheFileAlreadyExists({ command }: Context) {
    await command.run('make:command TestCommand')
    const output = await command.run('make:command TestCommand')

    output.assertFailed()
    output.assertLogged('[ MAKING COMMAND ]')
    output.assertLogged('The file')
    output.assertLogged('TestCommand.ts')
    output.assertLogged('already exists')
  }
}
