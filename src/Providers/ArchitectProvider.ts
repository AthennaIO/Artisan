/**
 * @athenna/architect
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Architect } from 'src/Architect'
import { ServiceProvider } from '@athenna/ioc'

export class ArchitectProvider extends ServiceProvider {
  /**
   * Register any application services.
   *
   * @return void
   */
  public register() {
    this.container.instance('Athenna/Core/Architect', new Architect())
  }
}
