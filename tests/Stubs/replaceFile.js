import { ArtisanLoader } from '#src/index'

export class ReplaceFile {
  /**
   * Register the commands for the application.
   *
   * @return {any[]}
   */
  get commands() {
    const internalCommands = [
      'dasdada',
      'dsadsad',
      'dsadsaa',
      'dswesas',
      'ewqasdw',
      'aqwerfs',
      'dswpoik',
      'lklopls',
      'ieumjhg',
    ]

    if (Env('NODE_ENV') !== 'production') {
      internalCommands.push(
        ...ArtisanLoader.loadCommands(),
        'dasdada',
        'dsadsad',
        'dsadsaa',
        'dswesas',
        'ewqasdw',
        'aqwerfs',
        'dswpoik',
        'lklopls',
        'ieumjhg',
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
    const object = {
      dasdada: 'dasdada',
      dsadsad: 'dsadsad',
      dsadsaa: 'dsadsaa',
      dswesas: 'dswesas',
      ewqasdw: 'ewqasdw',
      aqwerfs: 'aqwerfs',
      dswpoik: 'dswpoik',
      lklopls: 'lklopls',
      ieumjhg: 'ieumjhg',
    }

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
