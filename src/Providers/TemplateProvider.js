/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ServiceProvider } from '@athenna/ioc'
import { TemplateHelper } from '#src/Helpers/TemplateHelper'

export class TemplateProvider extends ServiceProvider {
  /**
   * Register any application services.
   *
   * @return {void}
   */
  register() {
    this.container.instance(
      'Athenna/Helpers/Template',
      new TemplateHelper(),
      false,
    )
  }
}
