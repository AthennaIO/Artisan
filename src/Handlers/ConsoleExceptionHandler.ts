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
import { Is, String } from '@athenna/common'

export class ConsoleExceptionHandler {
  /**
   * The exception handler of all Artisan commands.
   */
  public async handle(error: any): Promise<void> {
    error.code = String.toSnakeCase(error.code || error.name).toUpperCase()

    const isException = Is.Exception(error)
    const isDebugMode = Config.get('app.debug', true)
    const isInternalServerError = Is.Error(error) && !isException

    if (!isException) {
      error = error.toAthennaException()
    }

    if (isInternalServerError && !isDebugMode) {
      error.name = 'Internal server error'
      error.code = 'E_INTERNAL_SERVER_ERROR'
      error.message = 'An internal server exception has occurred.'

      delete error.stack
    }

    if (error.code === 'E_SIMPLE_CLI') {
      Log.channelOrVanilla('console').error(error.message)

      return process.exit(1)
    }

    Log.channelOrVanilla('exception').error(await error.prettify())

    return process.exit(1)
  }
}
