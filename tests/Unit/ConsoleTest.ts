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
import { Kernel } from '../Stubs/app/Console/Kernel'
import { Artisan } from 'src/Facades/Artisan'
import { File, Folder, Path } from '@secjs/utils'
import { ArtisanProvider } from 'src/Providers/ArtisanProvider'
import { LoggerProvider } from '@athenna/logger/src/Providers/LoggerProvider'

describe('\n ConsoleTest', () => {
  beforeEach(async () => {
    new Folder(Path.tests('Stubs/config')).loadSync().copySync(Path.config())
    new Folder(Path.tests('Stubs/app/Console')).loadSync().copySync(Path.app('Console'))
    new Folder(Path.tests('Stubs/app/Console/Exceptions')).loadSync().copySync(Path.app('Console/Exceptions'))

    await Config.load()
    new LoggerProvider().register()
    new ArtisanProvider().register()

    const kernel = new Kernel()

    await kernel.registerErrorHandler()
    await kernel.registerCommands()

    await import('../Stubs/routes/console')
  })

  it('should be able to execute commands from routes/console', async () => {
    await Artisan.call('make:hello helloWorld')

    const path = Path.pwd('helloWorld.txt')

    expect(existsSync(path)).toBe(true)
  }, 60000)

  afterEach(async () => {
    await Folder.safeRemove(Path.config())
    await Folder.safeRemove(Path.app())
    await File.safeRemove(Path.pwd('helloWorld.txt'))
  })
})
