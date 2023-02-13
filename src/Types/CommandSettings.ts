/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export type CommandSettings = {
  /**
   * Set if the command should load the application
   * before executing "handle" method.
   *
   * @default false
   */
  loadApp?: boolean

  /**
   * Set if the command should be exited or not be
   * fore executing "handle" method.
   *
   * @default false
   */
  stayAlive?: boolean

  /**
   * Set the environments where the command is running.
   *
   * @default ['artisan']
   */
  environments?: string[]
}
