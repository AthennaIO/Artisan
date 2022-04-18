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
import { Middleware } from 'src/Commands/Make/Middleware'
import { LoggerProvider } from '@athenna/logger/src/Providers/LoggerProvider'

describe('\n MakeMiddlewareTest', () => {
  beforeAll(async () => {
    new Folder(Path.tests('Stubs/config')).loadSync().copySync(Path.config())

    await Config.load()
    new LoggerProvider().register()
  })

  it('should be able to create a middleware file', async () => {
    await new Middleware().handle('TestMiddleware', {
      extension: 'ts',
      lint: true,
    })

    const path = Path.app('Http/Middlewares/TestMiddleware.ts')

    expect(existsSync(path)).toBe(true)
  }, 60000)

  it('should throw an error when the file already exists', async () => {
    await new Middleware().handle('TestMiddleware', {
      extension: 'ts',
      lint: true,
    })

    await new Middleware().handle('TestMiddleware', {
      extension: 'ts',
      lint: true,
    })
  }, 60000)

  afterEach(async () => {
    await Folder.safeRemove(Path.config())
    await Folder.safeRemove(Path.app())
  })
})
