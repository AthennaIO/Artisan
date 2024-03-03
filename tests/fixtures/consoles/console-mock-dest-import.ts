/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path } from '@athenna/common'
import { ViewProvider } from '@athenna/view'
import { Config, Rc } from '@athenna/config'
import { Artisan, ArtisanProvider } from '#src'
import { ListCommand } from '#src/commands/ListCommand'
import { ConfigureCommand } from '#src/commands/ConfigureCommand'
import { MakeCommandCommand } from '#src/commands/MakeCommandCommand'
import { TemplateCustomizeCommand } from '#src/commands/TemplateCustomizeCommand'

process.env.IS_TS = 'true'

await Config.loadAll(Path.fixtures('config'))

Config.set('rc.commands.make:command.path', '#src/commands/MakeCommandCommand')
Config.set('rc.commands.make:command.destination', './tests/fixtures/storage/commands')

await Rc.setFile(Path.pwd('package.json'))

new ViewProvider().register()
new ArtisanProvider().register()

Artisan.register(ListCommand)
Artisan.register(ConfigureCommand)
Artisan.register(MakeCommandCommand)
Artisan.register(TemplateCustomizeCommand)

await Artisan.parse(process.argv, 'Artisan')
