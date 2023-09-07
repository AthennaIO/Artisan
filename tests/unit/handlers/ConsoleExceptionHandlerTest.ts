/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { fake } from 'sinon'
import { Log } from '@athenna/logger'
import { Exception } from '@athenna/common'
import { ConsoleExceptionHandler } from '#src'
import { Test, ExitFaker, type Context } from '@athenna/test'
import { BaseCommandTest } from '#tests/helpers/BaseCommandTest'

export default class ConsoleExceptionHandlerTest extends BaseCommandTest {
  @Test()
  public async shouldBeAbleToLogThePrettyExceptionFromErrorInstances({ assert }: Context) {
    const mock = Log.getMock()
    mock
      .expects('channelOrVanilla')
      .exactly(1)
      .withArgs('exception')
      .returns({ error: () => {} })

    await new ConsoleExceptionHandler().handle(new Error())

    assert.isTrue(ExitFaker.faker.calledOnceWith(1))
    mock.verify()
  }

  @Test()
  public async shouldBeAbleToLogThePrettyExceptionFromExceptionInstances({ assert }: Context) {
    const mock = Log.getMock()
    mock
      .expects('channelOrVanilla')
      .exactly(1)
      .withArgs('exception')
      .returns({ error: () => {} })

    await new ConsoleExceptionHandler().handle(new Exception())

    assert.isTrue(ExitFaker.faker.calledOnceWith(1))
    mock.verify()
  }

  @Test()
  public async shouldBeAbleToLogInTheConsoleChannelIfTheExceptionCodeIsE_SIMPLE_CLI({ assert }: Context) {
    const mock = Log.getMock()
    mock
      .expects('channelOrVanilla')
      .exactly(1)
      .withArgs('console')
      .returns({ error: () => {} })

    await new ConsoleExceptionHandler().handle(new Exception({ code: 'E_SIMPLE_CLI' }))

    assert.isTrue(ExitFaker.faker.calledOnceWith(1))
    mock.verify()
  }

  @Test()
  public async shouldBeAbleToHideErrorsIfDebugModeIsNotActivatedAndIsInternalError({ assert }: Context) {
    Config.set('app.debug', false)

    const mockedError = fake()
    const mock = Log.getMock()
    mock.expects('channelOrVanilla').exactly(1).withArgs('exception').returns({ error: mockedError })

    await new ConsoleExceptionHandler().handle(new Error('hello'))

    const exception = new Exception({
      message: 'An internal server exception has occurred.',
      code: 'E_INTERNAL_SERVER_ERROR',
      status: 500
    })

    delete exception.stack

    assert.isTrue(mockedError.calledWith(await exception.prettify()))
    assert.isTrue(ExitFaker.faker.calledOnceWith(1))
    mock.verify()
  }

  @Test()
  public async shouldBeAbleToHideErrorsIfDebugModeIsNotActivatedAndIsInternalTypeError({ assert }: Context) {
    Config.set('app.debug', false)

    const mockedError = fake()
    const mock = Log.getMock()
    mock.expects('channelOrVanilla').exactly(1).withArgs('exception').returns({ error: mockedError })

    await new ConsoleExceptionHandler().handle(new TypeError('hello'))

    const exception = new Exception({
      message: 'An internal server exception has occurred.',
      code: 'E_INTERNAL_SERVER_ERROR',
      status: 500
    })

    delete exception.stack

    assert.isTrue(mockedError.calledWith(await exception.prettify()))
    assert.isTrue(ExitFaker.faker.calledOnceWith(1))
    mock.verify()
  }

  @Test()
  public async shouldBeAbleToHideErrorsIfDebugModeIsNotActivatedAndIsInternalSyntaxError({ assert }: Context) {
    Config.set('app.debug', false)

    const mockedError = fake()
    const mock = Log.getMock()
    mock.expects('channelOrVanilla').exactly(1).withArgs('exception').returns({ error: mockedError })

    await new ConsoleExceptionHandler().handle(new SyntaxError('hello'))

    const exception = new Exception({
      message: 'An internal server exception has occurred.',
      code: 'E_INTERNAL_SERVER_ERROR',
      status: 500
    })

    delete exception.stack

    assert.isTrue(mockedError.calledWith(await exception.prettify()))
    assert.isTrue(ExitFaker.faker.calledOnceWith(1))
    mock.verify()
  }
}
