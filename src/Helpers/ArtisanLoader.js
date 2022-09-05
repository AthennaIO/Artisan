import { Folder, Module, Path } from '@secjs/utils'
import { join } from 'node:path'

export class ArtisanLoader {
  /**
   * Return all commands from artisan console application.
   *
   * @return {any[]}
   */
  static loadCommands() {
    return [
      import('#src/Commands/List'),
      import('#src/Commands/Serve'),
      import('#src/Commands/Eslint/Fix'),
      import('#src/Commands/Make/Facade'),
      import('#src/Commands/Make/Service'),
      import('#src/Commands/Make/Command'),
      import('#src/Commands/Make/Provider'),
      import('#src/Commands/Make/Exception'),
      import('#src/Commands/Template/Customize'),
    ]
  }

  /**
   * Return all templates from artisan console application.
   *
   * @return {any[]}
   */
  static loadTemplates() {
    const dirname = Module.createDirname(import.meta.url)
    const templatesPath = join(dirname, '..', '..', 'templates')

    const templates = new Folder(templatesPath)
      .loadSync()
      .getFilesByPattern('**/*.ejs')

    if (Folder.existsSync(Path.resources('templates'))) {
      templates.push(
        ...new Folder(Path.resources('templates'))
          .loadSync()
          .getFilesByPattern('**/*.ejs'),
      )
    }

    return templates
  }
}
