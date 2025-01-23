/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Task } from '#src/helpers/Task'
import { Path, Sleep } from '@athenna/common'
import { Test, BeforeEach, type Context } from '@athenna/test'
import { RunningTaskException } from '#src/exceptions/RunningTaskException'

export default class TaskTest {
  @BeforeEach()
  public async beforeEach() {
    await Config.loadAll(Path.fixtures('config'))
  }

  @Test()
  public async shouldBeAbleToCreateTasksRunner({ assert }: Context) {
    let value = 'hello'

    Config.set('logging.channels.console.driver', 'null')

    await new Task()
      .add('Testing 1', async task => {
        assert.equal(task.status, 'running')
        await task.complete()
        assert.equal(task.status, 'complete')
      })
      .add('Testing 2', async task => {
        assert.equal(task.status, 'running')
        await task.fail('Error')
        assert.equal(task.status, 'fail')
      })
      .add('Testing 3', async task => {
        value = null
        await task.complete('Will not be executed.')
      })
      .run()

    assert.equal(value, 'hello')
  }

  @Test()
  public async shouldBeAbleToCreateTasksRunnerUsingPromises({ assert }: Context) {
    let value = 'hello'
    Config.set('logging.channels.console.driver', 'null')

    await new Task()
      .addPromise('Testing 1', async () => {
        await Sleep.for(100).milliseconds().wait()
      })
      .addPromise('Testing 2', async () => {
        await Sleep.for(100).milliseconds().wait()
      })
      .addPromise('Testing 3', async () => {
        value = null
        await Sleep.for(100).milliseconds().wait()
      })
      .run()

    assert.equal(value, null)
  }

  @Test()
  public async shouldThrowIfPromiseDoesNotResolveWhenUsingAddPromise({ assert }: Context) {
    Config.set('logging.channels.console.driver', 'null')

    const task = new Task()
      .addPromise('Testing 1', async () => {
        await Sleep.for(100).milliseconds().wait()
      })
      .addPromise('Testing 2', async () => {
        await Sleep.for(100).milliseconds().wait()
      })
      .addPromise('Testing 3', async () => {
        throw new Error('Error')
      })

    await assert.rejects(() => task.run(), Error)
  }

  @Test()
  public async shouldThrowRunningTaskExceptionIfExecutingCallbackAfterEndingTheTaskWithFail({ assert }: Context) {
    Config.set('logging.channels.console.driver', 'null')

    await assert.rejects(
      () =>
        new Task()
          .add('Testing 1', async task => {
            assert.equal(task.status, 'running')
          })
          .run(),
      RunningTaskException
    )
  }
}
