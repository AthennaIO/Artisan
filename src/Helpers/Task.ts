/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ora, { Ora } from 'ora'

import { ChalkInstance } from 'chalk'
import { Is, Color } from '@athenna/common'
import { TaskCallback } from '#src/Types/TaskCallback'
import { RunningTaskException } from '#src/Exceptions/RunningTaskException'

export type TaskMap = { title: string; cb: TaskCallback }

export class Task {
  /**
   * The tasks saved by "add" method.
   */
  private tasks: TaskMap[] = []

  /**
   * Add a new task to be executed.
   *
   * @example
   * ```ts
   * await this.logger
   *    .task()
   *    .add('hello', async task => {
   *      await Exec.sleep(1000)
   *      await task.complete('world')
   *    })
   *    .run()
   * ```
   * Output:
   * ```bash
   * → hello 1005ms
   *   world
   * ```
   */
  public add(title: string, cb: TaskCallback): Task {
    this.tasks.push({ title, cb })

    return this
  }

  /**
   * Run all the tasks added.
   *
   * @example
   * ```ts
   * await this.logger
   *    .task()
   *    .add('hello', async task => {
   *      await Exec.sleep(1000)
   *      await task.fail('Something went wrong')
   *    })
   *    .run()
   * ```
   * Output:
   * ```bash
   * → hello 1005ms
   *   Something went wrong
   * ```
   */
  public async run() {
    for (const task of this.tasks) {
      const nextTasksTitle = []

      for (let i = this.tasks.indexOf(task) + 1; i <= this.tasks.length; i++) {
        const task = this.tasks[i]

        if (!task) {
          break
        }

        nextTasksTitle.push(task.title)
      }

      const status = await new TaskManager(task, nextTasksTitle).run()

      if (status === 'fail') {
        break
      }
    }
  }
}

export class TaskManager {
  /**
   * The task map to manage.
   */
  public task: TaskMap

  /**
   * The time that the task has started running.
   */
  public time: number

  /**
   * The spinner instance to display feedback to the user.
   */
  public spinner: Ora

  /**
   * The next tasks title to be executed after this task.
   */
  public nextTasksTitle: string

  /**
   * The status of the task.
   */
  public status: 'idle' | 'running' | 'fail' | 'complete' = 'idle'

  public constructor(task: TaskMap, nextTasksTitle?: string[]) {
    this.task = task
    this.time = Date.now()
    this.spinner = ora({
      spinner: 'arrow',
      isSilent: Config.is('logging.channels.console.driver', 'null'),
    })
    this.nextTasksTitle = nextTasksTitle
      .map(nextTaskTitle => Color.dim(`→ ${nextTaskTitle}`))
      .join('\n')
  }

  /**
   * Run the the task and return if the status was fail or
   * complete.
   */
  public async run(): Promise<'fail' | 'complete'> {
    this.status = 'running'
    this.spinner.start(`${this.task.title}\n${this.nextTasksTitle}`)

    await this.task.cb(this)

    if (this.status === 'running') {
      throw new RunningTaskException(this.task.title)
    }

    return this.status as 'fail' | 'complete'
  }

  /**
   * Complete the task by setting a red arrow and
   * persisting the task name with an error message.
   *
   * @example
   * ```ts
   * await task.fail('Something went wrong')
   * ```
   */
  public async fail(error: any) {
    const ms = this.getMs()
    const icon = Color.red('→')
    const msg = this.getMessage(error, Color.red)

    this.spinner.stopAndPersist({
      symbol: icon,
      text: `${this.task.title} ${ms} ${msg}\n${this.nextTasksTitle}`,
    })

    this.status = 'fail'
  }

  /**
   * Complete the task by setting a green arrow and
   * persisting the task name with or without a message.
   *
   * @example
   * ```ts
   * await task.complete('Finished')
   * ```
   */
  public async complete(message?: string) {
    const ms = this.getMs()
    const icon = Color.green('→')
    const msg = this.getMessage(message, Color.dim)

    this.spinner.stopAndPersist({
      symbol: icon,
      text: `${this.task.title} ${ms}${msg}`,
    })

    this.status = 'complete'
  }

  /**
   * Get the time in MS that has been required to run the
   * task.
   */
  private getMs() {
    return Color.dim(`${Date.now() - this.time}ms`)
  }

  /**
   * Get the message value painted if it exists.
   */
  private getMessage(message: string | Error, color: ChalkInstance) {
    if (!message) {
      return ''
    }

    if (Is.Object(message) && message.message) {
      return '\n  '.concat(color(message.message))
    }

    return '\n  '.concat(color(message))
  }
}
