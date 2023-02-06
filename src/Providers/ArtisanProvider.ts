/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ServiceProvider } from '@athenna/ioc'
import { ArtisanImpl } from '#src/Artisan/ArtisanImpl'

export class ArtisanProvider extends ServiceProvider {
  public register() {
    this.container.instance('Athenna/Core/Artisan', new ArtisanImpl(), false)
  }
}
