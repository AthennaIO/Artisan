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
    return Exec.link(libraries, options)
  }

  public async install(
    libraries: string | string[],
    options?: InstallPackageOptions
  ) {
    return Exec.install(libraries, options)
  }
}
