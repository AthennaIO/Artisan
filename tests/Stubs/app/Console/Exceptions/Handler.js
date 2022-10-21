import { ConsoleExceptionHandler } from '#src/Handlers/ConsoleExceptionHandler'

/*
|--------------------------------------------------------------------------
| Console Exception Handler
|--------------------------------------------------------------------------
|
| Athenna will forward all exceptions occurred during an Artisan command
| execution to the following class. You can learn more about exception
| handling by reading docs.
|
*/

export class Handler extends ConsoleExceptionHandler {
  /**
   * The global exception handler of all Artisan commands.
   *
   * @param {import('@athenna/common').Exception} error
   * @return {Promise<void>}
   */
  async handle(error) {
    return super.handle(error)
  }
}
