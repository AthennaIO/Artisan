/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Config, Rc } from '@athenna/config'
import { ViewProvider } from '@athenna/view'
import { File, Folder } from '@athenna/common'
import { LoggerProvider } from '@athenna/logger'
import { Mock, AfterEach, BeforeEach, type Stub } from '@athenna/test'
import { ConsoleKernel, ArtisanProvider, CommanderHandler } from '#src'
import { TestCommand } from '#src/testing/plugins/index'

export class BaseCommandTest {
  public artisan = Path.pwd('bin/artisan.ts')
  public processExit: Stub
  public originalPJson = new File(Path.pwd('package.json')).getContentAsStringSync()

  @BeforeEach()
  public async beforeEach() {
    this.processExit = Mock.when(process, 'exit').return(undefined)

    TestCommand.setArtisanPath(this.artisan)

    process.env.ARTISAN_TESTING = 'true'

    await Config.loadAll(Path.fixtures('config'))

    new ViewProvider().register()
    new LoggerProvider().register()
    new ArtisanProvider().register()

    const kernel = new ConsoleKernel()

    await Rc.setFile(Path.pwd('package.json'))

    await kernel.registerExceptionHandler()
    await kernel.registerCommands()
  }

  @AfterEach()
  public async afterEach() {
    Config.clear()
    ioc.reconstruct()
    Mock.restoreAll()

    delete process.env.ARTISAN_TESTING

    CommanderHandler.getCommander<any>()._events = {}
    CommanderHandler.getCommander<any>().commands = []
    CommanderHandler.getCommander<any>()._version = undefined

    await Folder.safeRemove(Path.app())
    await Folder.safeRemove(Path.config())
    await Folder.safeRemove(Path.resources())
    await Folder.safeRemove(Path.fixtures('storage'))
    await Folder.safeRemove(Path.fixtures('build'))

    await File.safeRemove(Path.pwd('.env'))
    await File.safeRemove(Path.pwd('.env.test'))
    await File.safeRemove(Path.pwd('.env.example'))
    await File.safeRemove(Path.pwd('docker-compose.yml'))

    await new File(Path.pwd('package.json')).setContent(this.originalPJson)
  }
}
