/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Color } from '@athenna/common'

export class Action {
  /**
   * The main action that is being executed.
   *
   * @example
   *  'CREATE'
   */
  private action: string

  /**
   * Holds the biggest action of the Action instance.
   * This property is useful to determine how much spaces
   * we need to add to the log message before rendering it.
   *
   * @example
   *  'CREATE'
   */
  private biggestAction: string

  public constructor(action: string) {
    this.action = action
    this.biggestAction = this.getBiggestAction(action)
  }

  /**
   * Log a succeeded action in the console.
   *
   * @example
   * ```ts
   * const action = this.logger.action('create')
   *
   * action.succeeded('app/Services/Service.ts')
   * ```
   * Output:
   * ```bash
   * CREATE: app/Services/Service.ts
   * ```
   */
  public succeeded(msg: string): void {
    const spaces = this.getSpacesFor(this.action)
    const action = Color.green.bold(`${this.action.toUpperCase()}:`)

    this.log(`${action}${spaces}${msg}`)
  }

  /**
   * Log a skipped action in the console.
   *
   * @example
   * ```ts
   * const action = this.logger.action('create')
   *
   * action.skipped('app/Services/Service.ts', 'File already exists')
   * ```
   * Output:
   * ```bash
   * SKIP:   app/Services/Service.ts (File already exists)
   * ```
   */
  public skipped(msg: string, reason?: string): void {
    const spaces = this.getSpacesFor('SKIP')
    const action = Color.cyan.bold('SKIP:')
    let logMsg = `${action}${spaces}${msg}`

    if (reason) {
      logMsg = logMsg.concat(Color.dim(` (${reason})`))
    }

    this.log(logMsg)
  }

  /**
   * Log a failed action in the console.
   *
   * @example
   * ```ts
   * const action = this.logger.action('create')
   *
   * action.failed('app/Services/Service.ts', 'Something went wrong')
   * ```
   * Output:
   * ```bash
   * ERROR:  app/Services/Service.ts (Something went wrong)
   * ```
   */
  public failed(msg: string, reason?: string): void {
    const spaces = this.getSpacesFor('ERROR')
    const action = Color.red.bold('ERROR:')
    let logMsg = `${action}${spaces}${msg}`

    if (reason) {
      logMsg = logMsg.concat(Color.dim(` (${reason})`))
    }

    this.log(logMsg)
  }

  /**
   * Simple write a log to the stdout concatenating a '\n'
   * character at the end.
   */
  private log(msg: string): void {
    process.stdout.write(Color.apply(msg).concat('\n'))
  }

  /**
   * Get only the necessary spaces for the action. This
   * method will use the "biggestAction" property to determine
   * how much space the action in the method argument will need
   * to match the column pattern.
   */
  private getSpacesFor(action: string): string {
    let string = ' '

    if (action === this.biggestAction) {
      return string
    }

    for (let i = 0; i < this.biggestAction.length - action.length; i++) {
      string = string.concat(' ')
    }

    return string
  }

  /**
   * Get the biggest action. If the action of the method argument
   * is not bigger than 'ERROR' action, then the biggest action is
   * 'ERROR', because 'SKIP' is not bigger than 'ERROR'.
   */
  private getBiggestAction(action: string): string {
    if (action.length < 'ERROR'.length) {
      return 'ERROR'
    }

    return action
  }
}
