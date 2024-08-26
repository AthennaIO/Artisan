/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export type CallInChildOptions = {
  /**
   * The artisan file path that will be used to
   * invoke the child process.
   *
   * @default Path.bin(`console.${Path.ext()}`)
   */
  path?: string
}
