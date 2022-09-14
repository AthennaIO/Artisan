import { Config, Module, Path } from '@secjs/utils'
import { LoggerProvider } from '@athenna/logger/providers/LoggerProvider'

import { Artisan } from '#src/index'
import { Kernel } from '#tests/Stubs/app/Console/Kernel'
import { ArtisanProvider } from '#src/Providers/ArtisanProvider'

await new Config().safeLoad(Path.config('app.js'))
await new Config().safeLoad(Path.config('logging.js'))

new LoggerProvider().register()
new ArtisanProvider().register()

const kernel = new Kernel()

await kernel.registerErrorHandler()
await kernel.registerCommands()
await kernel.registerTemplates()

await Module.import(Path.stubs('routes/console.js'))

Artisan.main()
