/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path } from '@athenna/common'

export default {
  typescript: Env('IS_TS', false),
  commands: [
    Path.stubs('Test.ts'),
    Path.pwd('src/Commands/ListCommand.ts'),
    Path.pwd('src/Commands/MakeCommandCommand.ts'),
    Path.pwd('src/Commands/TemplateCustomize.ts'),
  ],
  commandsManifest: {
    test: Path.stubs('Test.ts'),
    list: Path.pwd('src/Commands/ListCommand.ts'),
    'make:command': Path.pwd('src/Commands/MakeCommandCommand.ts'),
    'template:customize': Path.pwd('src/Commands/TemplateCustomize.ts'),
  },
}
