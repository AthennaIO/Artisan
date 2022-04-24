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
import { Kernel } from '../../Stubs/app/Console/Kernel'
import { Folder, Path } from '@secjs/utils'
import { Artisan } from 'src/Facades/Artisan'
import { ArtisanProvider } from 'src/Providers/ArtisanProvider'
import { LoggerProvider } from '@athenna/logger/src/Providers/LoggerProvider'

describe('\n ListTest', () => {
  beforeEach(async () => {
    new Folder(Path.tests('Stubs/providers')).loadSync().copySync(Path.providers())
    new Folder(Path.tests('Stubs/config')).loadSync().copySync(Path.config())
    new Folder(Path.tests('Stubs/app/Console')).loadSync().copySync(Path.app('Console'))
    new Folder(Path.tests('Stubs/app/Console/Exceptions')).loadSync().copySync(Path.app('Console/Exceptions'))

    await Config.load()
    new LoggerProvider().register()
    new ArtisanProvider().register()

    const kernel = new Kernel()

    await kernel.registerErrorHandler()
    await kernel.registerCommands()
  })

  it('should be able to list all commands from eslint alias', async () => {
    await Artisan.call('list eslint')
  }, 60000)

  it('should be able to list all commands from make alias', async () => {
    await Artisan.call('list make')
  }, 60000)

  it('should be able to list all commands from route alias', async () => {
    await Artisan.call('list route')
  }, 60000)

  it('should be able to list all commands from list alias', async () => {
    await Artisan.call('list list')
  }, 60000)

  it('should be able to list all commands from not-existent alias', async () => {
    await Artisan.call('list not-existent')
  }, 60000)

  afterEach(async () => {
    await Folder.safeRemove(Path.providers())
    await Folder.safeRemove(Path.config())
    await Folder.safeRemove(Path.app())
  })
})
