/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ViewProvider } from '@athenna/view'
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

Config.set('rc.commands', [
  Path.stubs('Test.ts'),
  Path.pwd('src/Commands/ListCommand.ts'),
  Path.pwd('src/Commands/TemplateCustomize.ts'),
  Path.pwd('src/Commands/MakeCommandCommand.ts'),
])

new ViewProvider().register()
new ArtisanProvider().register()

const kernel = new ConsoleKernel()

await kernel.registerExceptionHandler()
await kernel.registerCommands()

await Artisan.parse(process.argv, 'Artisan')
