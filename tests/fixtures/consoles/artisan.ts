/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Artisan, ArtisanProvider } from '#src'
import { HelloCommand } from '#tests/fixtures/HelloCommand'
import { SimpleCommand } from '#tests/fixtures/SimpleCommand'
import { AnnotatedCommand } from '#tests/fixtures/AnnotatedCommand'

process.env.IS_TS = 'true'

new ArtisanProvider().register()

Artisan.register(HelloCommand)
Artisan.register(SimpleCommand)
Artisan.register(AnnotatedCommand)

await Artisan.parse(process.argv, 'Artisan')
