import { join } from 'node:path'
import { Folder, Module } from '@athenna/common'

export class ArtisanLoader {
  /**
   * Return all commands from artisan console application.
   *
   * @return {any[]}
   */
  static loadCommands() {
    return [
      import('#src/Commands/List'),
      import('#src/Commands/Eslint/Fix'),
      import('#src/Commands/Make/Command'),
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

    return new Folder(templatesPath).loadSync().getFilesByPattern('**/*.edge')
  }
}
