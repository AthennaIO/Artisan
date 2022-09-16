import { Log } from '@athenna/logger'
import { Config, Exception, String } from '@secjs/utils'

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

    if (body.code === 'E_SIMPLE_CLI') {
      return Log.channel('console').error(body.message)
    }

    if (error.prettify) {
      const prettyError = await error.prettify()

      Log.channel('exception').error(prettyError.concat('\n'))

      process.exit()

      return
    }

    const exception = new Exception(
      body.message,
      body.statusCode,
      body.code,
      body.help,
    )

    exception.stack = body.stack

    const prettyError = await exception.prettify()

    Log.channel('exception').error(prettyError.concat('\n'))

    process.exit()
  }
}
