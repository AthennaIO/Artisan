import { Artisan } from '#src/index'
import { Exception } from '@athenna/common'

Artisan.command('test:error [treated] [simple]', async function (treated, simple) {
  if (treated) {
    throw new Exception('Testing Exception', 500, simple ? 'E_SIMPLE_CLI' : 'E_RUNTIME', 'Restart computer.')
  }

  throw new Error('Testing Error')
})
