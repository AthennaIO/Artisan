/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import '@athenna/ioc'
import { Config } from '@athenna/config'
import { Kernel } from 'tests/Stubs/Kernel'
import { Artisan } from 'src/Facades/Artisan'
import { Folder, Path } from '@secjs/utils'
import { ArtisanProvider } from 'src/Providers/ArtisanProvider'
import { LoggerProvider } from '@athenna/logger/src/Providers/LoggerProvider'

describe('\n ListRouteTest', () => {
  beforeEach(async () => {
    new Folder(Path.tests('Stubs/providers')).loadSync().copySync(Path.providers())
    new Folder(Path.tests('Stubs/config')).loadSync().copySync(Path.config())

    await Config.load()
    new LoggerProvider().register()
    new ArtisanProvider().register()
    await new Kernel().registerCommands()
  })

  it('should be able to list all commands from route', async () => {
    await Artisan.call('list:route')
  }, 60000)

  afterEach(async () => {
    await Folder.safeRemove(Path.providers())
    await Folder.safeRemove(Path.config())
    await Folder.safeRemove(Path.app())
  })
})
