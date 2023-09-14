/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import figlet from 'figlet'
import columnify from 'columnify'
import chalkRainbow from 'chalk-rainbow'

import { Task } from '#src/helpers/Task'
import { Table } from '#src/helpers/Table'
import { Action } from '#src/helpers/Action'
import { Sticker } from '#src/helpers/Sticker'
import { Logger } from '#src/helpers/command/Logger'
import { Instruction } from '#src/helpers/Instruction'
import { Test, BeforeEach, type Context, Mock } from '@athenna/test'

export default class LoggerTest {
  private logger = new Logger()

  @BeforeEach()
  public async beforeEach() {
    Config.set('logging.channels.console.level', 'trace')
    Config.set('logging.channels.console.driver', 'null')

    this.logger = new Logger()
  }

  @Test()
  public async shouldBeAbleToLogSimpleValuesWithoutAnyFormatInStdout({ assert }: Context) {
    const successFake = Mock.sandbox.fake()
    const standaloneFake = Mock.sandbox.fake(_configs => ({ success: successFake }))
    this.logger.standalone = standaloneFake as any

    this.logger.simple('hello')

    assert.calledWith(successFake, 'hello')
    assert.calledWith(standaloneFake, { level: 'trace', driver: 'null' })
  }

  @Test()
  public async shouldBeAbleToLogRainbowMessagesInStdout({ assert }: Context) {
    const simpleMock = Mock.sandbox.fake()
    this.logger.simple = simpleMock

    this.logger.rainbow('hello')

    assert.calledWith(simpleMock, chalkRainbow(figlet.textSync('hello')).concat('\n'))
  }

  @Test()
  public async shouldBeAbleToCreateANewTableHelperInstance({ assert }: Context) {
    const table = this.logger.table()

    assert.instanceOf(table, Table)
  }

  @Test()
  public async shouldBeAbleToLogColumnifiedMessagesInStdout({ assert }: Context) {
    const simpleMock = Mock.sandbox.fake()
    this.logger.simple = simpleMock

    this.logger.column({ hello: 'world' })

    assert.calledWith(simpleMock, columnify({ hello: 'world' }))
  }

  @Test()
  public async shouldBeAbleToCreateANewActionHelperInstance({ assert }: Context) {
    const action = this.logger.action('hello')

    assert.instanceOf(action, Action)
  }

  @Test()
  public async shouldBeAbleToCreateANewInstructionHelperInstance({ assert }: Context) {
    const instruction = this.logger.instruction()

    assert.instanceOf(instruction, Instruction)
  }

  @Test()
  public async shouldBeAbleToCreateANewStickerHelperInstance({ assert }: Context) {
    const sticker = this.logger.sticker()

    assert.instanceOf(sticker, Sticker)
  }

  @Test()
  public async shouldBeAbleToCreateANewTaskHelperInstance({ assert }: Context) {
    const task = this.logger.task()

    assert.instanceOf(task, Task)
  }
}
