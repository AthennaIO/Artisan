/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exec } from '@athenna/common'
import { Npm } from '#src/helpers/command/Npm'
import { Test, BeforeEach, type Context, Mock, AfterEach } from '@athenna/test'

export default class NpmTest {
  private npm = new Npm()

  @BeforeEach()
  public async beforeEach() {
    this.npm = new Npm()
  }

  @AfterEach()
  public async afterEach() {
    Mock.restoreAll()
  }

  @Test()
  public async shouldBeAbleToRunNpmLinkCommand({ assert }: Context) {
    Mock.when(Exec, 'link').resolve(undefined)

    await this.npm.link('@athenna/common')

    assert.calledOnceWith(Exec.link, '@athenna/common')
  }

  @Test()
  public async shouldBeAbleToRunNpmInstallCommand({ assert }: Context) {
    Mock.when(Exec, 'install').resolve(undefined)

    await this.npm.install('@athenna/common')

    assert.calledOnceWith(Exec.install, '@athenna/common')
  }
}
