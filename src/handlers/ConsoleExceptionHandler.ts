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
    if (error.code === undefined) {
      error.code = error.name || 'E_INTERNAL_SERVER'
    }

    error.code = String.toConstantCase(error.code)

    const isException = Is.Exception(error)
    const isDebugMode = Config.get('app.debug', true)
    const isInternalServerError = Is.Error(error) && !isException

    if (!isException) {
      error = error.toAthennaException()
    }

    if (isInternalServerError && !isDebugMode) {
      error.name = 'Internal error'
      error.code = 'E_INTERNAL_ERROR'
      error.message = 'An internal error has occurred.'

      delete error.stack
    }

    if (error.code === 'E_SIMPLE_CLI') {
      Log.channelOrVanilla('console').error(error.message)

      return process.exit(1)
    }

    if (Config.is('app.logger.prettifyException', true)) {
      Log.channelOrVanilla('exception').error(await error.prettify())

      return process.exit(1)
    }

    Log.channelOrVanilla('exception').error(error)

    return process.exit(1)
  }
}
