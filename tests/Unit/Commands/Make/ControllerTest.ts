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
import { Folder, Path } from '@secjs/utils'
import { Kernel } from 'tests/Stubs/Kernel'
import { Artisan } from 'src/Facades/Artisan'
import { ArtisanProvider } from 'src/Providers/ArtisanProvider'
import { LoggerProvider } from '@athenna/logger/src/Providers/LoggerProvider'

describe('\n MakeControllerTest', () => {
  beforeEach(async () => {
    new Folder(Path.tests('Stubs/config')).loadSync().copySync(Path.config())

    await Config.load()
    new LoggerProvider().register()
    new ArtisanProvider().register()
    await new Kernel().registerCommands()
  })

  it('should be able to create a controller file', async () => {
    await Artisan.call('make:controller TestController')

    const path = Path.app('Http/Controllers/TestController.ts')

    expect(existsSync(path)).toBe(true)
  }, 60000)

  it('should throw an error when the file already exists', async () => {
    await Artisan.call('make:controller TestController -e ts')
    await Artisan.call('make:controller TestController -e ts')
  }, 60000)

  afterEach(async () => {
    await Folder.safeRemove(Path.config())
    await Folder.safeRemove(Path.app())
  })
})
