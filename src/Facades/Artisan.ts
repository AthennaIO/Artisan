/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Facade } from '@athenna/ioc'
import { ArtisanImpl } from '#src/Artisan/ArtisanImpl'

export const Artisan = Facade.createFor<ArtisanImpl>('Athenna/Core/Artisan')
