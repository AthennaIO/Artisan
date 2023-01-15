import { Config } from '@athenna/config'
import { Module, Path } from '@athenna/common'
import { LoggerProvider } from '@athenna/logger/providers/LoggerProvider'

import { Artisan } from '#src/index'
import { Kernel } from '#tests/Stubs/app/Console/Kernel'
import { ArtisanProvider } from '#src/Providers/ArtisanProvider'
import { TemplateProvider } from '#src/Providers/TemplateProvider'

await Config.safeLoad(Path.config('app.js'))

new LoggerProvider().register()
new ArtisanProvider().register()
new TemplateProvider().register()

const kernel = new Kernel()

await kernel.registerErrorHandler()
await kernel.registerCommands()
await kernel.registerTemplates()

await Module.import(Path.stubs('routes/console.js'))

Artisan.main()
