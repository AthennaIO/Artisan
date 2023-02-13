/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@athenna/common'
import { ConsoleExceptionHandler } from '#src'
import { LoggerProvider } from '@athenna/logger'

new LoggerProvider().register()

let error = null
const type = process.argv[2]
const noDebug = process.argv[3]

if (noDebug === '--no-debug') {
  Config.set('app.debug', false)
}

switch (type) {
  case 'error':
    error = new Error('hello')
    break
  case 'exception':
    error = new Exception({ message: 'hello', help: 'hello' })
    break
}

await new ConsoleExceptionHandler().handle(error)
