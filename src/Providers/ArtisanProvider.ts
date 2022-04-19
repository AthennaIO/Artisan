/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Artisan } from 'src/Artisan'
import { ServiceProvider } from '@athenna/ioc'

export class ArtisanProvider extends ServiceProvider {
  /**
   * Register any application services.
   *
   * @return void
   */
  public register() {
    this.container.instance('Athenna/Core/Artisan', new Artisan())
  }
}
