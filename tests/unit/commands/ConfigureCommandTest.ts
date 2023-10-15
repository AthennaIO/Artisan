/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseTest } from '#tests/helpers/BaseTest'
import { Test, type Context } from '@athenna/test'

export default class ConfigureCommandTest extends BaseTest {
  @Test()
  public async shouldBeAbleToInstallLibrariesBeforeLookingUpTheConfigurer({ command }: Context) {
    const output = await command.run('configure some-lib-name', {
      path: Path.fixtures('consoles/console-mock-library.ts')
    })

    output.assertSucceeded()
    output.assertLogged('[  info  ] Configuring some-lib-name')
    output.assertLogged('✔ Library some-lib-name successfully installed')
  }

  @Test()
  public async shouldBeAbleToRunAConfiguratorFilePathDirectlyInsteadOfInstallingLibraries({ command }: Context) {
    const output = await command.run('configure ./tests/fixtures/configurators/foo/configurer/index.js', {
      path: Path.fixtures('consoles/console-mock-prompt.ts')
    })

    output.assertSucceeded()
    output.assertLogged('[  info  ] You selected something')
  }

  @Test()
  public async shouldThrowIfTheConfigurerFilePathCannotBeFound({ command }: Context) {
    const output = await command.run('configure not-found.js', {
      path: Path.fixtures('consoles/console-mock-prompt.ts')
    })

    output.assertFailed()
    output.assertLogged('NotFoundConfigurerException')
  }
}
