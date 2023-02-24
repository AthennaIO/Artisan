/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ViewProvider } from '@athenna/view'
import { LoggerProvider } from '@athenna/logger'
import { Artisan, ConsoleKernel, ArtisanProvider } from '#src'

/*
|--------------------------------------------------------------------------
| Set IS_TS env.
|--------------------------------------------------------------------------
|
| Set the IS_TS environement variable to true. Very useful when using the
| Path helper.
*/

process.env.IS_TS = 'true'

await Config.loadAll(Path.stubs('config'))

Config.delete('app.version')
Config.set('rc.meta', import.meta.url)
Config.set('logging.channels.console.driver', 'console')
Config.set('logging.channels.exception.driver', 'console')

new ViewProvider().register()
new LoggerProvider().register()
new ArtisanProvider().register()

const kernel = new ConsoleKernel()

await kernel.registerExceptionHandler()
await kernel.registerCommands(process.argv)
await kernel.registerRouteCommands(Path.pwd('not-found.ts'))
await kernel.registerRouteCommands(Path.pwd('bin/console.ts'))

await Artisan.parse(process.argv, 'Artisan')
