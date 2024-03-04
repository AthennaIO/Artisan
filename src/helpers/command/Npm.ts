/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
  Exec,
  type LinkPackageOptions,
  type InstallPackageOptions
} from '@athenna/common'

import { Rc } from '@athenna/config'

export class Npm {
  /**
   * Run `npm link` command inside a child process.
   *
   * @example
   * ```ts
   * await this.npm.link('@athenna/common')
   * ```
   *
   * By default the registry used will be `npm`, but you
   * can change it by adding your registry in options:
   *
   * @example
   * ```ts
   * await this.npm.link('@athenna/common', { registry: 'yarn' })
   * ```
   */
  public async link(
    libraries: string | string[],
    options?: LinkPackageOptions
  ) {
    await Exec.link(libraries, options).then(() => {
      if (Rc.file.base === 'package.json') {
        return Rc.reload()
      }
    })
  }

  /**
   * Run `npm install` command inside a child process.
   *
   * @example
   * ```ts
   * await this.npm.install('@athenna/common')
   * ```
   *
   * By default the registry used will be `npm`, but you
   * can change it by adding your registry in options:
   *
   * @example
   * ```ts
   * await this.npm.install('@athenna/common', { registry: 'yarn' })
   * ```
   */
  public async install(
    libraries: string | string[],
    options?: InstallPackageOptions
  ) {
    await Exec.install(libraries, options).then(() => {
      if (Rc.file.base === 'package.json') {
        return Rc.reload()
      }
    })
  }
}
