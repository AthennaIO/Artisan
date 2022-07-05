/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ConsoleKernel } from '#src/Kernels/ConsoleKernel'
import { ArtisanLoader } from '#src/Helpers/ArtisanLoader'

export class Kernel extends ConsoleKernel {
  /**
   * Register the commands for the application.
   */
  commands = [...ArtisanLoader.loadCommands()]
}
