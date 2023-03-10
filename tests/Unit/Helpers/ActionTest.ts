/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { fake } from 'sinon'
import { Color } from '@athenna/common'
import { Action } from '#src/Helpers/Action'
import { Log, LoggerProvider } from '@athenna/logger'
import { BeforeEach, Test, TestContext } from '@athenna/test'

export default class ActionTest {
  private action: Action = null

  @BeforeEach()
  public async beforeEach() {
    Config.set('logging.channels.console.level', 'trace')
    Config.set('logging.channels.console.driver', 'null')

    new LoggerProvider().register()
    this.action = new Action('CREATE')
  }

  @Test()
  public async shouldBeAbleToLogASuccededActionInTheStdout({ assert }: TestContext) {
    const mock = Log.getMock()
    const successFake = fake()

    mock
      .expects('standalone')
      .exactly(1)
      .withArgs({ level: 'trace', driver: 'null' })
      .returns({ success: _args => successFake(Color.removeColors(_args)) })

    this.action.succeeded('app/Services/Service.ts')

    assert.isTrue(successFake.calledWith('CREATE: app/Services/Service.ts'))
    mock.verify()
  }

  @Test()
  public async shouldBeAbleToLogASkipedActionInTheStdout({ assert }: TestContext) {
    const mock = Log.getMock()
    const successFake = fake()

    mock
      .expects('standalone')
      .exactly(1)
      .withArgs({ level: 'trace', driver: 'null' })
      .returns({
        success: _args => successFake(Color.removeColors(_args)),
      })

    this.action.skipped('app/Services/Service.ts')

    assert.isTrue(successFake.calledWith('SKIP:   app/Services/Service.ts'))
    mock.verify()
  }

  @Test()
  public async shouldBeAbleToLogASkipedActionWithReasonInTheStdout({ assert }: TestContext) {
    const mock = Log.getMock()
    const successFake = fake()

    mock
      .expects('standalone')
      .exactly(1)
      .withArgs({ level: 'trace', driver: 'null' })
      .returns({
        success: _args => successFake(Color.removeColors(_args)),
      })

    this.action.skipped('app/Services/Service.ts', 'Some reason')

    assert.isTrue(successFake.calledWith('SKIP:   app/Services/Service.ts (Some reason)'))
    mock.verify()
  }

  @Test()
  public async shouldBeAbleToLogAFailedActionInTheStdout({ assert }: TestContext) {
    const mock = Log.getMock()
    const successFake = fake()

    mock
      .expects('standalone')
      .exactly(1)
      .withArgs({ level: 'trace', driver: 'null' })
      .returns({
        success: _args => successFake(Color.removeColors(_args)),
      })

    this.action.failed('app/Services/Service.ts')

    assert.isTrue(successFake.calledWith('ERROR:  app/Services/Service.ts'))
    mock.verify()
  }

  @Test()
  public async shouldBeAbleToLogAFailedActionWithReasonInTheStdout({ assert }: TestContext) {
    const mock = Log.getMock()
    const successFake = fake()

    mock
      .expects('standalone')
      .exactly(1)
      .withArgs({ level: 'trace', driver: 'null' })
      .returns({
        success: _args => successFake(Color.removeColors(_args)),
      })

    this.action.failed('app/Services/Service.ts', 'Some reason')

    assert.isTrue(successFake.calledWith('ERROR:  app/Services/Service.ts (Some reason)'))
    mock.verify()
  }

  @Test()
  public async shouldBeAbleToCreateAnActionInstanceWhereTheErrorActionIsTheBiggest({ assert }: TestContext) {
    const action = new Action('OK')
    const mock = Log.getMock()
    const successFake = fake()

    mock
      .expects('standalone')
      .exactly(1)
      .withArgs({ level: 'trace', driver: 'null' })
      .returns({
        success: _args => successFake(Color.removeColors(_args)),
      })

    action.succeeded('app/Services/Service.ts')

    assert.isTrue(successFake.calledWith('OK:    app/Services/Service.ts'))
    mock.verify()
  }
}
