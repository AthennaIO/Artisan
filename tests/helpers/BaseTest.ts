/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { File, Folder, Path } from '@athenna/common'
import { TestCommand } from '#src/testing/plugins/index'
import { ArtisanProvider, CommanderHandler } from '#src'
import { FixtureDatabase } from '#tests/fixtures/FixtureDatabase'
import { AfterEach, BeforeEach, Mock, type Stub } from '@athenna/test'

export class BaseTest {
  public processExitMock: Stub
  public originalPJson = new File(Path.pwd('package.json')).getContentAsStringSync()

  @BeforeEach()
  public async baseBeforeEach() {
    new ArtisanProvider().register()

    TestCommand.setArtisanPath(Path.fixtures('consoles/base-command.ts'))

    this.processExitMock = Mock.when(process, 'exit').return(undefined)
  }

  @AfterEach()
  public async baseAfterEach() {
    Mock.restoreAll()
    ioc.reconstruct()
    CommanderHandler.reconstruct()
    FixtureDatabase.clear()

    await Folder.safeRemove(Path.app())
    await Folder.safeRemove(Path.resources())
    await Folder.safeRemove(Path.fixtures('storage'))

    await new File(Path.pwd('package.json')).setContent(this.originalPJson)
  }

  /**
   * Safe import a module, avoiding cache and if
   * the module is not found, return null.
   */
  public async import<T = any>(path: string): Promise<T> {
    try {
      return await import(`${path}.js?version=${Math.random()}`)
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
