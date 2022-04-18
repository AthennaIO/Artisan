/**
 * @athenna/architect
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
import { Architect } from 'src/Facades/Architect'
import { ArchitectProvider } from 'src/Providers/ArchitectProvider'
import { LoggerProvider } from '@athenna/logger/src/Providers/LoggerProvider'

describe('\n MakeMiddlewareTest', () => {
  beforeAll(async () => {
    new Folder(Path.tests('Stubs/config')).loadSync().copySync(Path.config())

    await Config.load()
    new LoggerProvider().register()
    new ArchitectProvider().register()
    await new Kernel().registerCommands()
  })

  it('should be able to create a middleware file', async () => {
    await Architect.call('make:middleware TestMiddleware')

    const path = Path.app('Http/Middlewares/TestMiddleware.ts')

    expect(existsSync(path)).toBe(true)
  }, 60000)

  it('should throw an error when the file already exists', async () => {
    await Architect.call('make:middleware TestMiddleware -e ts')
    await Architect.call('make:middleware TestMiddleware -e ts')
  }, 60000)

  afterEach(async () => {
    await Folder.safeRemove(Path.config())
    await Folder.safeRemove(Path.app())
  })
})
