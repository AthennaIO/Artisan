/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exec } from '@athenna/common'
import { Artisan } from '#src'

Artisan.route('error', async function () {
  throw new Error('error happened!')
})

Artisan.route('hello', async function (hello: string) {
  console.log(hello)
  console.log(Config.get('rc.commands.hello'))
})
  .argument('<hello>')
  .settings({ loadApp: false, stayAlive: false, environments: ['hello'] })

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
  await this.logger
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

  action.succeeded('app/services/Service.ts')
  action.skipped('app/services/Service.ts', 'File already exists')
  action.failed('app/services/Service.ts', 'Something went wrong')
})
