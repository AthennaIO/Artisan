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
import { File, Folder, Path } from '@secjs/utils'
import { Kernel } from '../../../Stubs/app/Console/Kernel'
import { Artisan } from 'src/Facades/Artisan'
import { ArtisanProvider } from 'src/Providers/ArtisanProvider'
import { LoggerProvider } from '@athenna/logger/src/Providers/LoggerProvider'

describe('\n MakeMiddlewareTest', () => {
  beforeEach(async () => {
    new Folder(Path.tests('Stubs/app/Console')).loadSync().copySync(Path.app('Console'))
    new Folder(Path.tests('Stubs/app/Console/Exceptions')).loadSync().copySync(Path.app('Console/Exceptions'))
    new Folder(Path.tests('Stubs/app/Http')).loadSync().copySync(Path.app('Http'))
    new Folder(Path.tests('Stubs/config')).loadSync().copySync(Path.config())

    await Config.load()
    new LoggerProvider().register()
    new ArtisanProvider().register()

    const kernel = new Kernel()

    await kernel.registerErrorHandler()
    await kernel.registerCommands()
  })

  it('should be able to create a middleware file', async () => {
    await Artisan.call('make:middleware TestMiddleware --no-register')

    const path = Path.app('Http/Middlewares/TestMiddleware.ts')

    expect(existsSync(path)).toBe(true)
  }, 60000)

  it('should be able to create a middleware file and register it inside Kernel', async () => {
    const oldKernelLength = new File(Path.app('Http/Kernel.ts')).getContentSync().toString().length

    await Artisan.call('make:middleware KernelMiddleware -e ts')

    const newKernelLength = new File(Path.app('Http/Kernel.ts')).getContentSync().toString().length

    expect(newKernelLength).not.toBe(oldKernelLength)
  }, 60000)

  it('should throw an error when the file already exists', async () => {
    await Artisan.call('make:middleware TestMiddleware -e ts --no-register')
    await Artisan.call('make:middleware TestMiddleware -e ts --no-register')
  }, 60000)

  afterEach(async () => {
    await Folder.safeRemove(Path.config())
    await Folder.safeRemove(Path.app())
  })
})
