/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import '@athenna/ioc'

import { existsSync } from 'fs'
import { Config } from '@athenna/config'
import { Kernel } from 'tests/Stubs/Kernel'
import { Artisan } from 'src/Facades/Artisan'
import { File, Folder, Path } from '@secjs/utils'
import { ArtisanProvider } from 'src/Providers/ArtisanProvider'
import { LoggerProvider } from '@athenna/logger/src/Providers/LoggerProvider'

describe('\n MakeProviderTest', () => {
  beforeEach(async () => {
    new Folder(Path.tests('Stubs/config')).loadSync().copySync(Path.config())

    await Config.load()
    new LoggerProvider().register()
    new ArtisanProvider().register()
    await new Kernel().registerCommands()
  })

  it('should be able to create a provider file', async () => {
    await Artisan.call('make:provider TestProvider --no-register')

    const path = Path.providers('TestProvider.ts')

    expect(existsSync(path)).toBe(true)
  }, 60000)

  it('should be able to create a provider file and register it inside Kernel', async () => {
    const oldAppConfigLength = new File(Path.config('app.ts')).getContentSync().toString().length

    await Artisan.call('make:provider KernelProvider -e ts')

    const newAppConfigLength = new File(Path.config('app.ts')).getContentSync().toString().length

    expect(newAppConfigLength).not.toBe(oldAppConfigLength)
  }, 60000)

  it('should throw an error when the file already exists', async () => {
    await Artisan.call('make:provider TestProvider -e ts --no-register')
    await Artisan.call('make:provider TestProvider -e ts --no-register')
  }, 60000)

  afterEach(async () => {
    await Folder.safeRemove(Path.providers())
    await Folder.safeRemove(Path.config())
    await Folder.safeRemove(Path.app())
  })
})
