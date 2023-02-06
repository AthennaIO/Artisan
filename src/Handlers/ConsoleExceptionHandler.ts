/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Log } from '@athenna/logger'
import { Config } from '@athenna/config'
import { String } from '@athenna/common'

export class ConsoleExceptionHandler {
  /**
   * The exception handler of all Artisan commands.
   */
  public async handle(error: any): Promise<void> {
    const code = error.code || error.name

    const body: any = {
      code: String.toSnakeCase(code).toUpperCase(),
      name: error.name,
      message: error.message,
      stack: error.stack,
    }

    if (error.help) {
      body.help = error.help
    }

    const isInternalServerError =
      error.name && (error.name === 'Error' || error.name === 'TypeError')
    const isDebugMode = Config.get('app.debug')

    if (isInternalServerError && !isDebugMode) {
      body.name = 'Internal server error'
      body.message = 'An internal server exception has occurred.'

      delete body.stack
    }

    if (body.code === 'E_SIMPLE_CLI') {
      Log.channelOrVanilla('console').error(body.message)

      return this.exit()
    }

    if (!error.prettify) {
      error = error.toAthennaException()
    }

    Log.channelOrVanilla('exception').error(
      (await error.prettify()).concat('\n'),
    )

    return this.exit()
  }

  /**
   * Helper to exit the process if is not in testing environment.
   */
  private exit(code = 1) {
    if (!Env('ARTISAN_TESTING', false)) {
      return
    }

    process.exit(code)
  }
}
