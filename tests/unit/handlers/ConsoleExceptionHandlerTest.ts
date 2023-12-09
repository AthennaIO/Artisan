/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@athenna/common'
import { ConsoleExceptionHandler } from '#src'
import { Log, LoggerProvider } from '@athenna/logger'
import { Test, Mock, AfterEach, BeforeEach, type Context, type Stub } from '@athenna/test'

export default class ConsoleExceptionHandlerTest {
  public processExitMock: Stub

  @BeforeEach()
  public beforeEach() {
    new LoggerProvider().register()
    this.processExitMock = Mock.when(process, 'exit').return(1)
  }

  @AfterEach()
  public afterEach() {
    ioc.reconstruct()
    Mock.restoreAll()
    Config.clear()
  }

  @Test()
  public async shouldBeAbleToHandleAVanillaError({ assert }: Context) {
    const error = new Error('Test error')
    const errorFake = Mock.fake()
    Log.when('channelOrVanilla').return({
      error: errorFake
    })

    await new ConsoleExceptionHandler().handle(error)

    assert.calledWith(this.processExitMock, 1)
    assert.calledWith(errorFake, await error.toAthennaException().prettify())
  }

  @Test()
  public async shouldBeAbleToHandleAnAthennaException({ assert }: Context) {
    const exception = new Exception({ message: 'Test error' })
    const errorFake = Mock.fake()
    Log.when('channelOrVanilla').return({
      error: errorFake
    })

    await new ConsoleExceptionHandler().handle(exception)

    assert.calledWith(this.processExitMock, 1)
    assert.calledWith(errorFake, await exception.prettify())
  }

  @Test()
  public async shouldLogOnlyTheErrorMessageIfTheErrorCodeIsSimpleCLI({ assert }: Context) {
    const exception = new Exception({ code: 'E_SIMPLE_CLI', message: 'Test error' })
    const errorFake = Mock.fake()
    Log.when('channelOrVanilla').return({
      error: errorFake
    })

    await new ConsoleExceptionHandler().handle(exception)

    assert.calledWith(this.processExitMock, 1)
    assert.calledWith(errorFake, 'Test error')
  }

  @Test()
  public async shouldBeAbleToHideErrorMessageCodeAndStackIfIsInternalErrorAndAppIsNotInDebugMode({ assert }: Context) {
    Config.set('app.debug', false)

    const error = new Error('Test error')
    const errorFake = Mock.fake()
    Log.when('channelOrVanilla').return({
      error: errorFake
    })

    await new ConsoleExceptionHandler().handle(error)

    assert.calledWith(this.processExitMock, 1)
    assert.calledOnce(errorFake)
  }
}
