/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Facade } from '@athenna/ioc'

/**
 * @type {typeof Facade & import('#src/index').ArtisanImpl}
 */
export const Artisan = Facade.createFor('Athenna/Core/Artisan')
