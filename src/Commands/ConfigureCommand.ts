/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { extname, resolve } from 'node:path'
import { Argument, BaseCommand } from '#src'
import { Color, Exec, File, Module } from '@athenna/common'
import { NotFoundConfigurerException } from '#src/Exceptions/NotFoundConfigurerException'

export class ConfigureCommand extends BaseCommand {
  @Argument({
    signature: '<libraries...>',
    description:
      'One or more libraries to be configured. (Example: artisan configure @athenna/mail @athenna/database)',
  })
  public libraries: string[]

  public static signature(): string {
    return 'configure'
  }

  public static description(): string {
    return 'Configure one or more libraries inside your application.'
  }

  public async handle(): Promise<void> {
    for (const library of this.libraries) {
      await this.configure(library)
    }
  }

  private async configure(library: string) {
    const isFile = this.isFile(library)
    const isInstalled = await this.isInstalled(library)

    if (!isFile && !isInstalled) {
      await this.logger.promiseSpinner(Exec.command(`npm install ${library}`), {
        text: `Installing ${Color.chalk.magenta(library)} library`,
        failText: `Failed to install ${Color.chalk.magenta(library)} library`,
        successText: `Library ${Color.chalk.magenta(
          library,
        )} succesfully installed`,
      })
    }

    const path = isFile
      ? resolve(library)
      : Path.nodeModules(`${library}/configurer/index.js`)

    if (!(await File.exists(path))) {
      throw new NotFoundConfigurerException(path, library)
    }

    const Configurer = await Module.getFrom(path)

    await new Configurer().setPath(path).configure()
  }

  private isFile(library: string): boolean {
    return !!extname(library)
  }

  private async isInstalled(library: string): Promise<boolean> {
    const json = await new File(Path.pwd('package.json')).getContentAsJson()

    if (json.dependencies[library]) {
      return true
    }

    return !!json.devDependencies[library]
  }
}
