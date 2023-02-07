/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Task } from '#src/Helpers/Task'
import { RunningTaskException } from '#src/Exceptions/RunningTaskException'

test.group('TaskTest', () => {
  test('should be able to create tasks runner', async ({ assert }) => {
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
  })

  test('should throw running task exception if executing callback without ending the task', async ({ assert }) => {
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
  })
})
