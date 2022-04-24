import { Log } from '@athenna/logger'
import { String } from '@secjs/utils'
import { Config } from '@athenna/config'

export class ConsoleExceptionHandler {
  /**
   * Set if error logs will come with stack.
   *
   * @protected
   */
  protected addStack = false

  /**
   * The global exception handler of all Artisan commands.
   *
   * @param error
   */
  public async handle(error) {
    const code = error.code || error.name

    const body: any = {
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
    const isDebugMode = Config.get<boolean>('app.debug')

    if (isInternalServerError && !isDebugMode) {
      body.name = 'Internal server error'
      body.message = 'An internal server exception has occurred.'

      delete body.stack
    }

    const logConfig = {
      formatterConfig: {
        context: 'ExceptionHandler',
      },
    }

    let message = `${body.code === 'NULL' ? '' : body.code + ': '}${
      body.message
    }`

    if (this.addStack) {
      // eslint-disable-next-line no-template-curly-in-string
      message = message.concat('\nStack: ${body.stack}')
      Log.channel('console').error(message, logConfig)

      return
    }

    Log.channel('console').error(message, logConfig)
  }
}
