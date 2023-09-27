/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Artisan, ArtisanProvider } from '#src'
import { PluginCommand } from '#tests/fixtures/PluginCommand'

new ArtisanProvider().register()

Artisan.register(PluginCommand)

await Artisan.parse(process.argv, 'Artisan')
