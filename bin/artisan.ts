/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exec } from '@athenna/common'
import { ViewProvider } from '@athenna/view'
import { LoggerProvider } from '@athenna/logger'
import { Artisan, ConsoleKernel, ArtisanProvider } from '#src'
import { COMMANDS_SETTINGS } from '#src/Constants/CommandsSettings'

/*
|--------------------------------------------------------------------------
| Set IS_TS env.
|--------------------------------------------------------------------------
|
| Set the IS_TS environement variable to true. Very useful when using the
| Path helper.
*/

process.env.IS_TS = 'true'

await Config.loadAll(Path.stubs('config'))

Config.delete('app.version')
Config.set('logging.channels.console.driver', 'console')
Config.set('logging.channels.exception.driver', 'console')

new ViewProvider().register()
new LoggerProvider().register()
new ArtisanProvider().register()

const kernel = new ConsoleKernel()

await kernel.registerExceptionHandler()
await kernel.registerCommands()

Artisan.route('hello', async function (hello: string) {
  console.log(hello)
  console.log(COMMANDS_SETTINGS.get('hello'))
})
  .argument('<hello>')
  .settings({ loadApp: false, stayAlive: false, environment: ['hello'] })

Artisan.route('logger', async function () {
  this.logger.simple('hello')
  this.logger.simple('\n({bold,green} [ HELLO ])\n')

  this.logger.update('hello test')
  this.logger.update('hello updated')
  this.logger.rainbow('hello')
  this.logger
    .spinner()
    .start('hello start spinner')
    .succeed('hello end spinner')
  await this.logger.promiseSpinner(() => Exec.sleep(10), {
    successText: 'hello success',
    failText: 'hello fail',
  })
  this.logger
    .task()
    .add('hello', async task => task.complete())
    .run()
  this.logger.table().head('hello').render()
  this.logger.sticker().add('').render()
  this.logger.instruction().add('').render()
  this.logger.column(
    {
      hello: 'world',
    },
    { columns: ['KEY', 'VALUE'] },
  )

  const action = this.logger.action('create')

  action.succeeded('app/Services/Service.ts')
  action.skipped('app/Services/Service.ts', 'File already exists')
  action.failed('app/Services/Service.ts', 'Something went wrong')
})

await Artisan.parse(process.argv, 'Artisan')
