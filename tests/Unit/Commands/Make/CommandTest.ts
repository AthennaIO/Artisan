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
import { Kernel } from 'tests/Stubs/Kernel'
import { Artisan } from 'src/Facades/Artisan'
import { ArtisanProvider } from 'src/Providers/ArtisanProvider'
import { LoggerProvider } from '@athenna/logger/src/Providers/LoggerProvider'

describe('\n MakeCommandTest', () => {
  beforeEach(async () => {
    new Folder(Path.tests('Stubs/app/Console')).loadSync().copySync(Path.app('Console'))
    new Folder(Path.tests('Stubs/config')).loadSync().copySync(Path.config())

    await Config.load()
    new LoggerProvider().register()
    new ArtisanProvider().register()
    await new Kernel().registerCommands()
  })

  it('should be able to create a command file', async () => {
    await Artisan.call('make:command TestCommand --no-register')

    const path = Path.app('Console/Commands/TestCommand.ts')

    expect(existsSync(path)).toBe(true)
  }, 60000)

  it('should be able to create a command file and register it inside Kernel', async () => {
    const oldKernelLength = new File(Path.app('Console/Kernel.ts')).getContentSync().toString().length

    await Artisan.call('make:command KernelCommand -e ts')

    const newKernelLength = new File(Path.app('Console/Kernel.ts')).getContentSync().toString().length

    expect(newKernelLength).not.toBe(oldKernelLength)
  }, 60000)

  it('should throw an error when the file already exists', async () => {
    await Artisan.call('make:command TestCommand -e ts --no-register')
    await Artisan.call('make:command TestCommand -e ts --no-register')
  }, 60000)

  afterEach(async () => {
    await Folder.safeRemove(Path.config())
    await Folder.safeRemove(Path.app())
  })
})
