export class ArtisanLoader {
  /**
   * Return all commands from artisan http application.
   *
   * @return {any[]}
   */
  static loadHttp() {
    return [
      ...ArtisanLoader.loadConsole(),
      import('#src/Commands/Route/List'),
      import('#src/Commands/Make/Controller'),
      import('#src/Commands/Make/Middleware'),
    ]
  }

  /**
   * Return all commands from artisan console application.
   *
   * @return {any[]}
   */
  static loadConsole() {
    return [
      import('#src/Commands/Test'),
      import('#src/Commands/List'),
      import('#src/Commands/Serve'),
      import('#src/Commands/Eslint/Fix'),
      import('#src/Commands/Make/Test'),
      import('#src/Commands/Make/Facade'),
      import('#src/Commands/Make/Service'),
      import('#src/Commands/Make/Command'),
      import('#src/Commands/Make/Provider'),
      import('#src/Commands/Make/Exception'),
    ]
  }
}
