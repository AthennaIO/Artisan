/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Mock } from '@athenna/test'
import { Prompt } from '#src/helpers/command/Prompt'

Mock.when(Prompt.prototype, 'list').return('something')

await import('#tests/fixtures/consoles/base-command')
