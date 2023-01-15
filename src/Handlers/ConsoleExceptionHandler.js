import { Config } from '@athenna/config'
import { String } from '@athenna/common'
import { Log, Logger } from '@athenna/logger'

export class ConsoleExceptionHandler {
  /**
   * The global exception handler of all Artisan commands.
   *
   * @param {any} error
   * @return {Promise<void>}
   */
  async handle(error) {
    const code = error.code || error.name

    const body = {
      code: String.toSnakeCase(`${code}`).toUpperCase(),
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

    let logger = Logger.getVanillaLogger({
      level: 'trace',
      driver: 'console',
      streamType: 'stderr',
      formatter: body.code === 'E_SIMPLE_CLI' ? 'cli' : 'none',
    })

    if (body.code === 'E_SIMPLE_CLI') {
      if (Config.exists('logging.channels.console')) {
        logger = Log.channel('console')
      }

      return logger.error(body.message)
    }

    if (!error.prettify) {
      error = error.toAthennaException()
    }

    if (Config.exists('logging.channels.exception')) {
      logger = Log.channel('exception')
    }

    logger.error((await error.prettify()).concat('\n'))

    process.exit()
  }
}
