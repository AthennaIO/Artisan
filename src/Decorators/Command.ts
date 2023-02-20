/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'reflect-metadata'

import { Artisan } from '#src/Facades/Artisan'

/**
 * Register the command in Artisan.
 */
export function Command(): ClassDecorator {
  return (Target: any) => {
    Artisan.register(new Target())
  }
}
