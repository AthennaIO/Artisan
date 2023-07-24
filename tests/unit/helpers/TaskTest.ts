/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Task } from '#src/helpers/Task'
import { BeforeEach, Test } from '@athenna/test'
import type { Context } from '@athenna/test/types'
import { RunningTaskException } from '#src/exceptions/RunningTaskException'

export default class TaskTest {
  @BeforeEach()
  public async beforeEach() {
    await Config.loadAll(Path.stubs('config'))
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
  public async shouldThrowRunningTaskExceptionIfExecutingCallbackAfterEndingTheTaskWithFail({ assert }: Context) {
    Config.set('logging.channels.console.driver', 'null')

    await assert.rejects(
      () =>
        new Task()
          .add('Testing 1', async task => {
            assert.equal(task.status, 'running')
          })
          .run(),
      RunningTaskException,
    )
  }
}
