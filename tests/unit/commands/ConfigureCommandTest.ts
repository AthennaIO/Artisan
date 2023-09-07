/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { fake } from 'sinon'
import { Artisan } from '#src'
import { Config } from '@athenna/config'
import { Exec, File } from '@athenna/common'
import { Test, ExitFaker, type Context } from '@athenna/test'
import { BaseCommandTest } from '#tests/helpers/BaseCommandTest'

export default class ConfigureCommandTest extends BaseCommandTest {
  @Test()
  public async shouldBeAbleToConfigurePathsInsideTheApplication({ assert }: Context) {
    await Artisan.call('configure ./tests/fixtures/library/configurer/index.js')

    const { athenna } = await new File(Path.pwd('package.json')).getContentAsJson()

    assert.containsSubset(Config.get('rc.providers'), ['./tests/fixtures/library/providers/DatabaseProvider.js'])
    assert.containsSubset(athenna.providers, ['./tests/fixtures/library/providers/DatabaseProvider.js'])

    assert.containsSubset(athenna.commands, {
      'make:model': './tests/fixtures/library/commands/MakeModelCommand.js'
    })
    assert.containsSubset(Config.get('rc.commands'), {
      'make:model': './tests/fixtures/library/commands/MakeModelCommand.js'
    })
  }

  @Test()
  public async shouldBeAbleToConfigureLibrariesInsideTheApplicationAndThrowErrorWhenConfigureDoesNotExist({
    assert
  }: Context) {
    const originalCommand = Exec.command
    const commandFake = fake()

    Exec.command = (...args: any[]) => Promise.resolve(commandFake(...args))

    await Artisan.call('configure some-lib-name', false)

    Exec.command = originalCommand

    assert.isTrue(commandFake.calledOnceWith('npm install some-lib-name'))
    assert.isTrue(ExitFaker.faker.calledWith(1)) // <- Means that some error happened
  }
}
