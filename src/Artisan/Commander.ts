/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CommandSettings } from '#src'
import { Command as Commander } from 'commander'

declare module 'commander' {
  interface Command {
    settings(settings: CommandSettings): void
  }
}

export { Commander }
