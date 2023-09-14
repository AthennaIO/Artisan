/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Log } from '@athenna/logger'
import { Exception } from '@athenna/common'
import { ConsoleExceptionHandler } from '#src'
import { Test, type Context, Mock } from '@athenna/test'
import { BaseCommandTest } from '#tests/helpers/BaseCommandTest'

export default class ConsoleExceptionHandlerTest extends BaseCommandTest {
  @Test()
  public async shouldBeAbleToLogThePrettyExceptionFromErrorInstances({ assert }: Context) {
    const stub = Log.when('channelOrVanilla').return({ error: () => {} })

    await new ConsoleExceptionHandler().handle(new Error())

    assert.calledWith(stub, 'exception')
    assert.isTrue(this.processExit.calledOnceWith(1))
  }

  @Test()
  public async shouldBeAbleToLogThePrettyExceptionFromExceptionInstances({ assert }: Context) {
    const stub = Log.when('channelOrVanilla').return({ error: () => {} })

    await new ConsoleExceptionHandler().handle(new Exception())

    assert.calledWith(stub, 'exception')
    assert.isTrue(this.processExit.calledOnceWith(1))
  }

  @Test()
  public async shouldBeAbleToLogInTheConsoleChannelIfTheExceptionCodeIsE_SIMPLE_CLI({ assert }: Context) {
    const stub = Log.when('channelOrVanilla').return({ error: () => {} })

    await new ConsoleExceptionHandler().handle(new Exception({ code: 'E_SIMPLE_CLI' }))

    assert.calledWith(stub, 'console')
    assert.isTrue(this.processExit.calledOnceWith(1))
  }

  @Test()
  public async shouldBeAbleToHideErrorsIfDebugModeIsNotActivatedAndIsInternalError({ assert }: Context) {
    Config.set('app.debug', false)

    const fake = Mock.sandbox.fake()
    const stub = Log.when('channelOrVanilla').return({ error: fake })

    await new ConsoleExceptionHandler().handle(new Error('hello'))

    const exception = new Exception({
      message: 'An internal server exception has occurred.',
      code: 'E_INTERNAL_SERVER_ERROR',
      status: 500
    })

    delete exception.stack

    assert.calledWith(stub, 'exception')
    assert.isTrue(fake.calledWith(await exception.prettify()))
    assert.isTrue(this.processExit.calledOnceWith(1))
  }

  @Test()
  public async shouldBeAbleToHideErrorsIfDebugModeIsNotActivatedAndIsInternalTypeError({ assert }: Context) {
    Config.set('app.debug', false)

    const fake = Mock.sandbox.fake()
    const stub = Log.when('channelOrVanilla').return({ error: fake })

    await new ConsoleExceptionHandler().handle(new TypeError('hello'))

    const exception = new Exception({
      message: 'An internal server exception has occurred.',
      code: 'E_INTERNAL_SERVER_ERROR',
      status: 500
    })

    delete exception.stack

    assert.calledWith(stub, 'exception')
    assert.isTrue(fake.calledWith(await exception.prettify()))
    assert.isTrue(this.processExit.calledOnceWith(1))
  }

  @Test()
  public async shouldBeAbleToHideErrorsIfDebugModeIsNotActivatedAndIsInternalSyntaxError({ assert }: Context) {
    Config.set('app.debug', false)

    const fake = Mock.sandbox.fake()
    const stub = Log.when('channelOrVanilla').return({ error: fake })

    await new ConsoleExceptionHandler().handle(new SyntaxError('hello'))

    const exception = new Exception({
      message: 'An internal server exception has occurred.',
      code: 'E_INTERNAL_SERVER_ERROR',
      status: 500
    })

    delete exception.stack

    assert.calledWith(stub, 'exception')
    assert.isTrue(fake.calledWith(await exception.prettify()))
    assert.isTrue(this.processExit.calledOnceWith(1))
  }
}
