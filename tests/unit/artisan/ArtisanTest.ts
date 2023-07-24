/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import figlet from 'figlet'

import { fake } from 'sinon'
import { Artisan } from '#src'
import { Test } from '@athenna/test'
import type { Context } from '@athenna/test/types'
import { BaseCommandTest } from '#tests/helpers/BaseCommandTest'

export default class ArtisanTest extends BaseCommandTest {
  @Test()
  public async shouldThrowAnErrorWhenTryingToExecuteACommandThatDoesNotExist({ assert }: Context) {
    const { stderr } = await Artisan.callInChild('not-found', this.artisan)

    assert.equal(stderr, "error: unknown command 'not-found'\n")
  }

  @Test()
  public async shouldBeAbleToLogTheApplicationNameInEntrypointCommands({ assert }: Context) {
    const { stdout } = await Artisan.callInChild('', this.artisan)

    const appNameFiglet = figlet.textSync('Artisan')

    assert.equal(stdout, appNameFiglet.concat('\n'))
  }

  @Test()
  public async shouldBeAbleToRegisterCommandsAsRoutes({ assert }: Context) {
    process.env.NODE_ENV = 'test'

    const { stderr, stdout } = await Artisan.callInChild('hello world', this.artisan)

    assert.equal(stderr, '')
    assert.equal(stdout, "world\n{ loadApp: false, stayAlive: false, environments: [ 'hello' ] }\n")

    process.env.NODE_ENV = undefined
  }

  @Test()
  public async shouldBeAbleToSetArgumentsAndOptionsUsingArgumentAndOptionDecorators({ assert }: Context) {
    const { stderr, stdout } = await Artisan.callInChild('test test --other', this.artisan)

    assert.equal(stderr, '')
    assert.equal(
      stdout,
      "test notRequiredArg true notRequiredOption\ntrue tests|node_modules [ 'tests', 'node_modules' ]\n",
    )
  }

  @Test()
  public async shouldBeAbleToLoadTheApplicationIfTheLoadAppOptionsIsTrue({ assert }: Context) {
    const fakeIgniteFire = fake()
    ioc.instance('Athenna/Core/Ignite', { fire: fakeIgniteFire })

    await Artisan.call('loadapp', false)

    assert.isTrue(fakeIgniteFire.calledWith(['worker', 'console']))
  }
}
