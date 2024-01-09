/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseTest } from '#tests/helpers/BaseTest'
import { Test, type Context, Mock } from '@athenna/test'
import { Annotation, Artisan, CommanderHandler } from '#src'
import { FixtureDatabase } from '#tests/fixtures/FixtureDatabase'

export default class ArtisanTest extends BaseTest {
  @Test()
  public async shouldBeAbleToRegisterAnArtisanCommand({ assert }: Context) {
    const { SimpleCommand } = await this.import('#tests/fixtures/SimpleCommand')

    Artisan.register(SimpleCommand)

    assert.isTrue(CommanderHandler.hasCommand(SimpleCommand.signature()))
  }

  @Test()
  public async shouldBeAbleToRegisterAnArtisanCommandWithArguments({ assert }: Context) {
    const { AnnotatedCommand, annotatedCommand } = await this.import('#tests/fixtures/AnnotatedCommand')

    Artisan.register(AnnotatedCommand)

    const args = CommanderHandler.getCommandArgs(AnnotatedCommand.signature())

    assert.deepEqual(
      args.map(arg => arg.name()),
      Annotation.getArguments(annotatedCommand).map(arg => arg.signatureName)
    )
  }

  @Test()
  public async shouldBeAbleToRegisterAnArtisanCommandWithOptions({ assert }: Context) {
    const { AnnotatedCommand, annotatedCommand } = await this.import('#tests/fixtures/AnnotatedCommand')

    Artisan.register(AnnotatedCommand)

    const opts = CommanderHandler.getCommandOpts(AnnotatedCommand.signature())

    assert.deepEqual(
      opts.map(opt => opt.flags),
      Annotation.getOptions(annotatedCommand).map(arg => arg.signature)
    )
  }

  @Test()
  public async shouldBeAbleToRegisterAnArtisanCommandAsARoute({ assert }: Context) {
    assert.plan(2)

    Artisan.route('hello', async function (hello: string, options: { hello: string }) {
      assert.equal(hello, 'world')
      assert.equal(options.hello, 'world')
    })
      .argument('<hello>', 'Description for hello arg.')
      .option('--hello [hello]', 'Description for hello option.')

    await CommanderHandler.parse(['node', 'artisan', 'hello', 'world', '--hello=world'])
  }

  @Test()
  public async shouldBeAbleToRegisterAnArtisanCommandAsARouteWithSettings({ assert }: Context) {
    const fakeFire = Mock.fake()
    ioc.singleton('Athenna/Core/Ignite', { fire: fakeFire })

    assert.plan(4)

    Artisan.route('hello', async function (hello: string, options: { hello: string }) {
      assert.equal(hello, 'world')
      assert.equal(options.hello, 'world')
    })
      .argument('<hello>', 'Description for hello arg.')
      .option('--hello [hello]', 'Description for hello option.')
      .settings({ loadApp: true, stayAlive: false, environments: ['hello', 'world'] })

    await Artisan.parse(['node', 'artisan', 'hello', 'world', '--hello=world'])

    assert.calledWith(fakeFire, ['hello', 'world'])
    assert.calledWith(process.exit, 0)
  }

  @Test()
  public async shouldBeAbleToCallArtisanCommandsInRuntime({ assert }: Context) {
    const { SimpleCommand } = await this.import('#tests/fixtures/SimpleCommand')

    Artisan.register(SimpleCommand)

    await Artisan.call('simple')

    assert.isTrue(FixtureDatabase.has('simple:command'))
  }

  @Test()
  public async shouldBeAbleToCallArtisanCommandsWithArgumentsInRuntime({ assert }: Context) {
    const { HelloCommand } = await this.import('#tests/fixtures/HelloCommand')

    Artisan.register(HelloCommand)

    await Artisan.call('hello Lenon')

    assert.isTrue(FixtureDatabase.has('hello:command'))
    assert.equal(FixtureDatabase.get('hello:command'), 'Lenon')
  }

  @Test()
  public async shouldBeAbleToCallArtisanCommandsWithOptionsInRuntime({ assert }: Context) {
    const { AnnotatedCommand } = await this.import('#tests/fixtures/AnnotatedCommand')

    Artisan.register(AnnotatedCommand)

    await Artisan.call('annotated Lenon 22 --with-name --with-age --add-email --no-foo')

    assert.isTrue(FixtureDatabase.has('annotated:command'))
    assert.deepEqual(FixtureDatabase.get('annotated:command'), {
      age: '22',
      email: 'lenon@athenna.io',
      name: 'Lenon',
      withName: true,
      withAge: true,
      withEmail: true,
      withFoo: false
    })
  }

  @Test()
  public async shouldBeAbleToCallArtisanCommandsInRuntimeWithSettings({ assert }: Context) {
    const { SimpleCommand } = await this.import('#tests/fixtures/SimpleCommand')

    Artisan.register(SimpleCommand)

    await Artisan.call('simple', { withSettings: true })

    assert.isTrue(FixtureDatabase.has('simple:command'))
    assert.calledWith(process.exit, 0)
  }

  @Test()
  public async shouldBeAbleToCallArtisanCommandsInChildProcess({ assert }: Context) {
    const { stdout, stderr, exitCode } = await Artisan.callInChild('simple', {
      path: Path.fixtures('consoles/artisan.ts')
    })

    assert.equal(stdout, '')
    assert.equal(stderr, '')
    assert.equal(exitCode, 0)
  }

  @Test()
  public async shouldBeAbleToCallArtisanCommandsWithArgumentsInChildProcess({ assert }: Context) {
    const { stdout, stderr, exitCode } = await Artisan.callInChild('hello Lenon', {
      path: Path.fixtures('consoles/artisan.ts')
    })

    assert.equal(stdout, '')
    assert.equal(stderr, '')
    assert.equal(exitCode, 0)
  }

  @Test()
  public async shouldBeAbleToCallArtisanCommandsWithOptionsInChildProcess({ assert }: Context) {
    const { stdout, stderr, exitCode } = await Artisan.callInChild(
      'annotated Lenon 22 --with-name --with-age --add-email --no-foo',
      {
        path: Path.fixtures('consoles/artisan.ts')
      }
    )

    assert.equal(stdout, '')
    assert.equal(stderr, '')
    assert.equal(exitCode, 0)
  }

  @Test()
  public async shouldBeAbleToAutomaticallyParseTheArtisanExtPathInCallInChildMethod({ assert }: Context) {
    const { stdout, stderr, exitCode } = await Artisan.callInChild('simple', {
      path: Path.fixtures('consoles/artisan.js')
    })

    assert.equal(stdout, '')
    assert.equal(stderr, '')
    assert.equal(exitCode, 0)
  }

  @Test()
  public async shouldBeAbleToParseTheArgvToPickTheRightCommandToExecute({ assert }: Context) {
    const { SimpleCommand } = await this.import('#tests/fixtures/SimpleCommand')

    Artisan.register(SimpleCommand)

    await Artisan.parse(['node', 'artisan', 'simple'])

    assert.isTrue(FixtureDatabase.has('simple:command'))
  }

  @Test()
  public async shouldBeAbleToRegisterAnArtisanCommandWithGlobalOptions({ assert }: Context) {
    const { GlobalAnnotatedCommand } = await this.import('#tests/fixtures/GlobalAnnotatedCommand')

    Artisan.register(GlobalAnnotatedCommand)

    const opts = CommanderHandler.getCommandOpts(GlobalAnnotatedCommand.signature())

    await Artisan.parse(['node', 'artisan', 'globalAnnotated'])

    assert.isEmpty(opts)
    assert.deepEqual(FixtureDatabase.get('globalAnnotated:command'), 'test')
  }
}
