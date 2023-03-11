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

import { fake } from 'sinon'
import { Task } from '#src/Helpers/Task'
import { Table } from '#src/Helpers/Table'
import { Action } from '#src/Helpers/Action'
import { Sticker } from '#src/Helpers/Sticker'
import { Logger } from '#src/Helpers/Command/Logger'
import { Instruction } from '#src/Helpers/Instruction'
import { BeforeEach, Test, TestContext } from '@athenna/test'

export default class LoggerTest {
  private logger = new Logger()

  @BeforeEach()
  public async beforeEach() {
    Config.set('logging.channels.console.level', 'trace')
    Config.set('logging.channels.console.driver', 'null')

    this.logger = new Logger()
  }

  @Test()
  public async shouldBeAbleToLogSimpleValuesWithoutAnyFormatInStdout({ assert }: TestContext) {
    const successFake = fake()
    const standaloneFake = fake(_configs => ({ success: successFake }))
    this.logger.standalone = standaloneFake as any

    this.logger.simple('hello')

    assert.isTrue(successFake.calledWith('hello'))
    assert.isTrue(standaloneFake.calledWith({ level: 'trace', driver: 'null' }))
  }

  @Test()
  public async shouldBeAbleToLogRainbowMessagesInStdout({ assert }: TestContext) {
    const simpleMock = fake()
    this.logger.simple = simpleMock

    this.logger.rainbow('hello')

    assert.isTrue(simpleMock.calledWith(chalkRainbow(figlet.textSync('hello')).concat('\n')))
  }

  @Test()
  public async shouldBeAbleToCreateANewTableHelperInstance({ assert }: TestContext) {
    const table = this.logger.table()

    assert.instanceOf(table, Table)
  }

  @Test()
  public async shouldBeAbleToLogColumnifiedMessagesInStdout({ assert }: TestContext) {
    const simpleMock = fake()
    this.logger.simple = simpleMock

    this.logger.column({ hello: 'world' })

    assert.isTrue(simpleMock.calledWith(columnify({ hello: 'world' })))
  }

  @Test()
  public async shouldBeAbleToCreateANewActionHelperInstance({ assert }: TestContext) {
    const action = this.logger.action('hello')

    assert.instanceOf(action, Action)
  }

  @Test()
  public async shouldBeAbleToCreateANewInstructionHelperInstance({ assert }: TestContext) {
    const instruction = this.logger.instruction()

    assert.instanceOf(instruction, Instruction)
  }

  @Test()
  public async shouldBeAbleToCreateANewStickerHelperInstance({ assert }: TestContext) {
    const sticker = this.logger.sticker()

    assert.instanceOf(sticker, Sticker)
  }

  @Test()
  public async shouldBeAbleToCreateANewTaskHelperInstance({ assert }: TestContext) {
    const task = this.logger.task()

    assert.instanceOf(task, Task)
  }
}
