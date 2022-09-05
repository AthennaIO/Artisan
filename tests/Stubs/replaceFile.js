import { ArtisanLoader } from '#src/index'

export class ReplaceFile {
  /**
   * Register the commands for the application.
   *
   * @return {any[]}
   */
  get commands() {
    const internalCommands = []

    if (process.env.NODE_ENV !== 'production') {
      internalCommands.push(
        ...ArtisanLoader.loadCommands(),
        'oi',
        'zap',
        'truc',
        'dale',
        'vtnc',
        'zsadsadasdasdas',
        'dsaldksaldksaldkasld',
      )
    }

    return [
      ...internalCommands,
      import('#app/Console/Commands/NewCommand'),
      import('#app/Console/Commands/Install/TestCommand'),
    ]
  }

  /**
   * Register the custom templates for the application.
   *
   * @return {any[]}
   */
  get templates() {
    return []
  }

  /**
   * Register the custom templates for the application.
   *
   * @return {any[]}
   */
  get object() {
    const object = {}

    return object
  }

  /**
   * Register the custom templates for the application.
   *
   * @return {any[]}
   */
  get getterObj() {
    return {}
  }
}
