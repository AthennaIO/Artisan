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
import logUpdate from 'log-update'
import chalkRainbow from 'chalk-rainbow'
import ora, { oraPromise, Ora, Options, PromiseOptions } from 'ora'

import { Task } from '#src/Helpers/Task'
import { Table } from '#src/Helpers/Table'
import { Action } from '#src/Helpers/Action'
import { Sticker } from '#src/Helpers/Sticker'
import { Instruction } from '#src/Helpers/Instruction'
import { Logger as AthennaLogger } from '@athenna/logger'
import { Is } from '@athenna/common'

export class Logger extends AthennaLogger {
  public constructor() {
    super()

    this.channelOrVanilla('console')
  }

  /**
   * Log a simple message without any formatter. You can
   * still use the logging engine.
   *
   * @example
   * ```ts
   * this.logger.simple('({bold,green} [ MAKING CONTROLLER ])\n')
   * ```
   * Output:
   * ```bash
   * [ MAKING CONTROLLER ] <- bold format with green color
   * ```
   */
  public simple(...args: any[]) {
    const level = Config.get('logging.channels.console.trace', 'trace')
    const driver = Config.get('logging.channels.console.driver', 'console')

    return this.standalone({ level, driver }).success(...args)
  }

  /**
   * Log by overwriting the previous output in the terminal.
   * Useful for rendering progress bars, animations, etc.
   */
  public update(...msg: string[]): void {
    return logUpdate(...msg)
  }

  /**
   * Log a message with rainbow colors and FIGfont format.
   *
   * @example
   * ```ts
   * this.logger.rainbow('hi')
   * ```
   * Output (Is better in terminal, I promise :P):
   * ```bash
   *  _     _
   * | |__ (_)
   * | '_ \| |
   * | | | | |
   * |_| |_|_|
   * ```
   */
  public rainbow(message: string): void {
    this.simple(chalkRainbow(figlet.textSync(message)).concat('\n'))
  }

  /**
   * Create a spinner to load something.
   *
   * @example
   * ```ts
   * const spinner = this.logger.spinner('Loading unicorns')
   *
   * spinner.start()
   *
   * setTimeout(() => {
   *   spinner.color = 'yellow'
   *   spinner.text = 'Loading rainbows'
   * }, 1000)
   * ```
   * Output:
   * ```bash
   * ⠦ Loading unicorns
   * ```
   */
  public spinner(msgOrOpts?: string | Options): Ora {
    const options: any = {
      isSilent: Config.is('logging.channels.console.driver', 'null'),
    }

    if (Is.String(msgOrOpts)) {
      options.text = msgOrOpts
    }

    return ora(options)
  }

  /**
   * Log a spinner from a promise. The spinner is stopped
   * with ".succeed()" if the promise fulfills or with .fail()
   * if it rejects. Returns the promise.
   *
   * @example
   * ```ts
   * async function test() {
   *   await Exec.sleep(2000)
   *   return { hello: 'world' }
   * }
   *
   * const result = await log.promiseSpinner<{ hello: string }>(() => test(), {
   *   text: 'Loading',
   *   failText: 'Failed!',
   *   successText: 'Success!',
   * })
   *
   * console.log(result)
   * ```
   * Output:
   * ```bash
   * ⠦ Loading -> ✔ Success!
   * { hello: 'world' }
   * ```
   */
  public async promiseSpinner<T = any>(
    promise: any,
    msgOrOpts?: string | PromiseOptions<T>,
  ): Promise<T> {
    const options: any = {
      isSilent: Config.is('logging.channels.console.driver', 'null'),
    }

    if (Is.String(msgOrOpts)) {
      options.text = msgOrOpts
    }

    return oraPromise(promise, options)
  }

  /**
   * Log a personalized table. To render the table you need
   * to call the "render" method at the end:
   *
   * @example
   * ```ts
   * this.logger
   *   .table()
   *   .head('hello', 'world') // The head will be in purple.
   *   .row(['hello', 'world'])
   *   .row(['hello', 'world'])
   *   .render()
   * ```
   * Output:
   * ```bash
   * ┌───────┬───────┐
   * │ hello │ world │ <- Purple.
   * ├───────┼───────┤
   * │ hello │ world │
   * ├───────┼───────┤
   * │ hello │ world │
   * └───────┴───────┘
   * ```
   */
  public table(): Table {
    return new Table()
  }

  /**
   * Create text-based columns suitable for console output
   * from objects or arrays of objects.
   *
   * @example
   * ```ts
   * const data = {
   *  "commander@0.6.1": 1,
   *  "minimatch@0.2.14": 3,
   *  "mkdirp@0.3.5": 2,
   *  "sigmund@1.0.0": 3
   * }
   *
   * this.logger.column(data, { columns: ['MODULE', 'COUNT'] })
   * ```
   * Output:
   * ```bash
   * MODULE            COUNT
   * commander@0.6.1   1
   * minimatch@0.2.14  3
   * mkdirp@0.3.5      2
   * sigmund@1.0.0     3
   * ```
   */
  public column(
    data: any[] | Record<string, any>,
    opts?: columnify.GlobalOptions,
  ): void {
    this.simple(columnify(data, opts))
  }

  /**
   * Log an action that is happening. Actions has three states
   * "succeeded", "skipped" and "failed". You can use actions
   * to explain to the user what happened to some determined
   * action.
   *
   * @example
   * ```ts
   * const path = 'app/Services/Service.ts'
   * const action = this.logger.action('create')
   *
   * action.succeeded(path)
   * action.skipped(path, 'File already exists')
   * action.failed(path, 'Something went wrong')
   * ```
   * Output:
   * ```bash
   * CREATE: app/Services/Service.ts
   * SKIP:   app/Services/Service.ts (File already exists)
   * ERROR:  app/Services/Service.ts (Something went wrong)
   * ```
   */
  public action(name: string): Action {
    return new Action(name)
  }

  /**
   * Log an instruction. You can display instructions for a given action by rendering them
   * inside a box.
   *
   * @example
   * ```ts
   * this.logger.instruction()
   *    .head('Project Created')
   *    .add(`cd ${this.colors.cyan('hello-world')}`)
   *    .add(`Run ${this.colors.cyan('node artisan serve --watch')} to start the server`)
   *    .render()
   * ```
   * Output:
   * ```bash
   * ╭────────────────────────────────────────────────────────────╮
   * │    Project Created                                         │
   * │────────────────────────────────────────────────────────────│
   * │                                                            │
   * │    ❯ cd hello-world                                        │
   * │    ❯ Run node artisan serve --watch to start the server    │
   * │                                                            │
   * ╰────────────────────────────────────────────────────────────╯
   * ```
   */
  public instruction(): Instruction {
    return new Instruction()
  }

  /**
   * Log a sticker. You can display stickers for a given action by rendering them
   * inside a box but without the icon in front. Stickers have the same API of Ins
   * tructions, but the rows will not have the icon in front.
   *
   * @example
   * ```ts
   * this.logger.sticker()
   *    .head('Project Created')
   *    .add(`cd ${this.colors.cyan('hello-world')}`)
   *    .add(`Run ${this.colors.cyan('node artisan serve --watch')} to start the server`)
   *    .render()
   * ```
   * Output:
   * ```bash
   * ╭──────────────────────────────────────────────────────────╮
   * │    Project Created                                       │
   * │──────────────────────────────────────────────────────────│
   * │                                                          │
   * │    cd hello-world                                        │
   * │    Run node artisan serve --watch to start the server    │
   * │                                                          │
   * ╰──────────────────────────────────────────────────────────╯
   * ```
   */
  public sticker(): Sticker {
    return new Sticker()
  }

  /**
   * Create a task runner that will log the status of each task. The task
   * method is very useful when you need to do a lot of tasks in order, giving
   * a status to all the tasks and how much time it has taken to execute.
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
   * → hello 1002ms
   *   world
   * ```
   */
  public task(): Task {
    return new Task()
  }
}
