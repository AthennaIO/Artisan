import { File, Path } from '@athenna/common'
import { Artisan, ArtisanProvider } from '#src'

import { Config, Rc } from '@athenna/config'
import { ViewProvider } from '@athenna/view'
import { ListCommand } from '#src/commands/ListCommand'
import { ConfigureCommand } from '#src/commands/ConfigureCommand'
import { MakeCommandCommand } from '#src/commands/MakeCommandCommand'
import { TemplateCustomizeCommand } from '#src/commands/TemplateCustomizeCommand'

await Config.loadAll(Path.fixtures('config'))

await new File(Path.resources('templates/test.edge'), '').load()
Config.set('rc.templates.test', Path.resources('templates/test.edge'))

await Rc.setFile(Path.pwd('package.json'))

new ViewProvider().register()
new ArtisanProvider().register()

Artisan.register(ListCommand)
Artisan.register(ConfigureCommand)
Artisan.register(MakeCommandCommand)
Artisan.register(TemplateCustomizeCommand)

await Artisan.parse(process.argv, 'Artisan')
