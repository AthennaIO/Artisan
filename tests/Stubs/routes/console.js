import { Artisan } from '#src/index'
import { Exception } from '@secjs/utils'

Artisan.command('test:error [treated]', async function (treated) {
  if (treated) {
    throw new Exception('Testing Exception', 500, 'E_RUNTIME', 'Restart computer.')
  }

  throw new Error('Testing Error')
})
