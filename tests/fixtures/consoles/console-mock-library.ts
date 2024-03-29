/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Mock } from '@athenna/test'
import { Config, Rc } from '@athenna/config'
import { ViewProvider } from '@athenna/view'
import { Path, File, Module } from '@athenna/common'
import { ListCommand } from '#src/commands/ListCommand'
import { BaseConfigurer, Artisan, ArtisanProvider } from '#src'
import { ConfigureCommand } from '#src/commands/ConfigureCommand'
import { MakeCommandCommand } from '#src/commands/MakeCommandCommand'
import { TemplateCustomizeCommand } from '#src/commands/TemplateCustomizeCommand'

class Configurer extends BaseConfigurer {
  public async configure() {
    this.logger.info('Configuring @athenna/test')
  }
}

process.env.IS_TS = 'true'

await Config.loadAll(Path.fixtures('config'))
await Rc.setFile(Path.pwd('package.json'))

new ViewProvider().register()
new ArtisanProvider().register()

Artisan.register(ListCommand)
Artisan.register(ConfigureCommand)
Artisan.register(MakeCommandCommand)
Artisan.register(TemplateCustomizeCommand)

Mock.when(File, 'exists').resolve(true)
Mock.when(Module, 'getFrom').resolve(Configurer)

await Artisan.parse(process.argv, 'Artisan')
