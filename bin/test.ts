/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Config } from '@athenna/config'
import { command } from '#src/testing/plugins/index'
import { Runner, assert, specReporter } from '@athenna/test'

Config.set('meta', import.meta.url)

await Runner.setTsEnv()
  .addPlugin(assert())
  .addPlugin(command())
  .addReporter(specReporter())
  .addPath('tests/unit/**/*.ts')
  .setCliArgs(process.argv.slice(2))
  .setGlobalTimeout(30000)
  .run()
