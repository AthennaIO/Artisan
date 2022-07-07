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
    ]
  }
}
