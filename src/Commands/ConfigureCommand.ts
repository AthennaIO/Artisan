/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { resolve } from 'node:path'
import { Argument, Command } from '#src'
import { Exec, File, Module } from '@athenna/common'
import { NotFoundConfigurerException } from '#src/Exceptions/NotFoundConfigurerException'

export class ConfigureCommand extends Command {
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

  private async isInstalled(library: string): Promise<boolean> {
    const buffer = await new File(Path.pwd('package.json')).getContent()
    const packageJson: any = JSON.parse(buffer.toString())

    if (packageJson.dependencies[library]) {
      return true
    }

    if (packageJson.devDependencies[library]) {
      return true
    }

    return false
  }

  private async configure(library: string) {
    const isFile =
      (await File.exists(resolve(library))) &&
      (await File.isFile(resolve(library)))
    const isInstalled = await this.isInstalled(library)

    if (!isFile && !isInstalled) {
      await this.logger.promiseSpinner(Exec.command(`npm install ${library}`), {
        text: `Installing ${library} library`,
        failText: `Failed to install ${library} library`,
        successText: `Library ${library} succesfully installed`,
      })
    }

    const path = isFile
      ? resolve(library)
      : Path.nodeModules(`${library}/build/Configurer/index.js`)

    if (!(await File.exists(path))) {
      throw new NotFoundConfigurerException(path, library)
    }

    const Configurer = await Module.getFrom(path)

    await new Configurer().setPath(path).configure()
  }
}
