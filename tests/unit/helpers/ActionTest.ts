/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Color } from '@athenna/common'
import { Action } from '#src/helpers/Action'
import { Log, LoggerProvider } from '@athenna/logger'
import { Test, BeforeEach, type Context, Mock } from '@athenna/test'

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
  public async shouldBeAbleToLogASucceededActionInTheStdout({ assert }: Context) {
    const successFake = Mock.fake()
    const stub = Log.when('standalone')
      .return({ success: _args => successFake(Color.removeColors(_args)) })
      .get()

    this.action.succeeded('app/Services/Service.ts')

    assert.calledTimesWith(stub, 1, { level: 'trace', driver: 'null' })
    assert.calledWith(successFake, 'CREATE: app/Services/Service.ts')
  }

  @Test()
  public async shouldBeAbleToLogASkippedActionInTheStdout({ assert }: Context) {
    const successFake = Mock.fake()
    const stub = Log.when('standalone')
      .return({ success: _args => successFake(Color.removeColors(_args)) })
      .get()

    this.action.skipped('app/Services/Service.ts')

    assert.calledTimesWith(stub, 1, { level: 'trace', driver: 'null' })
    assert.calledWith(successFake, 'SKIP:   app/Services/Service.ts')
  }

  @Test()
  public async shouldBeAbleToLogASkippedActionWithReasonInTheStdout({ assert }: Context) {
    const successFake = Mock.fake()
    const stub = Log.when('standalone')
      .return({ success: _args => successFake(Color.removeColors(_args)) })
      .get()

    this.action.skipped('app/Services/Service.ts', 'Some reason')

    assert.calledTimesWith(stub, 1, { level: 'trace', driver: 'null' })
    assert.calledWith(successFake, 'SKIP:   app/Services/Service.ts (Some reason)')
  }

  @Test()
  public async shouldBeAbleToLogAFailedActionInTheStdout({ assert }: Context) {
    const successFake = Mock.fake()
    const stub = Log.when('standalone')
      .return({ success: _args => successFake(Color.removeColors(_args)) })
      .get()

    this.action.failed('app/Services/Service.ts')

    assert.calledTimesWith(stub, 1, { level: 'trace', driver: 'null' })
    assert.calledWith(successFake, 'ERROR:  app/Services/Service.ts')
  }

  @Test()
  public async shouldBeAbleToLogAFailedActionWithReasonInTheStdout({ assert }: Context) {
    const successFake = Mock.fake()
    const stub = Log.when('standalone')
      .return({ success: _args => successFake(Color.removeColors(_args)) })
      .get()

    this.action.failed('app/Services/Service.ts', 'Some reason')

    assert.calledTimesWith(stub, 1, { level: 'trace', driver: 'null' })
    assert.calledWith(successFake, 'ERROR:  app/Services/Service.ts (Some reason)')
  }

  @Test()
  public async shouldBeAbleToCreateAnActionInstanceWhereTheErrorActionIsTheBiggest({ assert }: Context) {
    const action = new Action('OK')
    const successFake = Mock.fake()
    const stub = Log.when('standalone')
      .return({ success: _args => successFake(Color.removeColors(_args)) })
      .get()

    action.succeeded('app/Services/Service.ts')

    assert.calledTimesWith(stub, 1, { level: 'trace', driver: 'null' })
    assert.calledWith(successFake, 'OK:    app/Services/Service.ts')
  }
}
