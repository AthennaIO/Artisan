/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ServiceProvider } from '@athenna/ioc'
import { ArtisanImpl } from '#src/artisan/ArtisanImpl'

export class ArtisanProvider extends ServiceProvider {
  public register() {
    this.container.singleton('Athenna/Core/Artisan', ArtisanImpl)
  }
}
