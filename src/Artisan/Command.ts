/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { View } from '@athenna/view'
import { Commander } from '#src/Artisan/Commander'
import { Prompt } from '#src/Helpers/Command/Prompt'
import { Logger } from '#src/Helpers/Command/Logger'
import { File, Color, String } from '@athenna/common'
import { CommandSettings } from '#src/Types/CommandSettings'
import { AlreadyExistFileException } from '#src/Exceptions/AlreadyExistFileException'

export abstract class Command {
  /**
   * The command signature/name. This option will
   * define how the command should be called.
   */
  public static signature(): string {
    return ''
  }

  /**
   * The command description. This option will define
   * the command description when calling it with --help
   * argument.
   */
  public static description(): string {
    return ''
  }

  /**
   * Set the command settings.
   *
   * @default
   *  {
   *    loadApp: false,
   *    stayAlive: false,
   *    environment: ['console']
   *  }
   */
  public static settings(): CommandSettings {
    return {
      loadApp: false,
      stayAlive: false,
      environment: ['console'],
    }
  }

  /**
   * The Athenna colors ui kit. This methods uses the
   * Color helper class from @athenna/common package.
   * All the methods will return an instance of Chalk
   * API.
   */
  public paint = Color

  /**
   * The console logger. The console logger extends the
   * VanillaLogger class from "@athenna/logger" package.
   *
   * The driver used is the "console" with the "cli" formatter.
   */
  public logger = new Logger()

  /**
   * The prompt used to make questions. The prompt uses the
   * Inquirer API to prompt the questions and retrieve the
   * answers.
   */
  public prompt = new Prompt()

  /**
   * Execute the command setting args and options in the class
   */
  protected exec(): Promise<void> {
    if (!this.paint) this.paint = Color
    if (!this.logger) this.logger = new Logger()
    if (!this.prompt) this.prompt = new Prompt()

    const args: string[] = Reflect.getMetadata('artisan::arguments', this)
    const commander: Commander = Reflect.getMetadata('artisan::commander', this)

    const opts = commander.opts()

    args?.forEach(arg => (this[arg] = commander.args.shift()))
    Object.keys(opts).forEach(key => (this[key] = opts[key]))

    return this.handle()
  }

  /**
   * The command handler. This method will be called
   * to execute your command.
   */
  public abstract handle(): Promise<void>

  /**
   * Make a new file using templates.
   *
   * @example
   * ```ts
   * const path = Path.http(`Controllers/MyController.${Path.ext()}`)
   * const template = 'artisan::controller'
   * const properties = { custom: 'custom-props-for-template' }
   *
   * const file = await this.makeFile(path, template, properties)
   *
   * this.logger.success(`Controller ({yellow} "${file.name}") successfully created.`)
   * ```
   * The following properties will exist in templates when using this method:
   *
   * ```ts
   * {
   *   nameUp: 'MYCONTROLLER',
   *   nameCamel: 'myController',
   *   namePlural: 'MyControllers',
   *   namePascal: 'MyController',
   *   namePluralCamel: 'myControllers',
   *   namePluralPascal: 'MyControllers',
   *   nameUpTimestamp: 'MYCONTROLLER1675363499530',
   *   nameCamelTimestamp: 'myController1675363499530',
   *   namePluralTimestamp: 'MyControllers1675363499530',
   *   namePascalTimestamp: 'MyController1675363499530',
   *   namePluralCamelTimestamp: 'myControllers1675363499530',
   *   namePluralPascalTimestamp: 'MyControllers1675363499530',
   *   ...properties, // <- Custom properties
   * }
   * ```
   *
   * All of the above properties could be changed using the third argument of "makeFile" method.
   *
   */
  public async makeFile(
    path: string,
    templateName: string,
    customProperties: any = {},
  ): Promise<File> {
    const file = new File(path, Buffer.from(''))

    if (file.fileExists) {
      throw new AlreadyExistFileException(path)
    }

    const timestamp = Date.now()
    const nameUp = file.name.toUpperCase()
    const nameCamel = String.toCamelCase(file.name)
    const namePlural = String.pluralize(file.name)
    const namePascal = String.toPascalCase(file.name)
    const namePluralCamel = String.toCamelCase(String.pluralize(file.name))
    const namePluralPascal = String.toPascalCase(String.pluralize(file.name))

    const content = await View.render(templateName, {
      nameUp,
      nameCamel,
      namePlural,
      namePascal,
      namePluralCamel,
      namePluralPascal,
      nameUpTimestamp: `${nameUp}${timestamp}`,
      nameCamelTimestamp: `${nameCamel}${timestamp}`,
      namePluralTimestamp: `${namePlural}${timestamp}`,
      namePascalTimestamp: `${namePascal}${timestamp}`,
      namePluralCamelTimestamp: `${namePluralCamel}${timestamp}`,
      namePluralPascalTimestamp: `${namePluralPascal}${timestamp}`,
      ...customProperties,
    })

    file.content = Buffer.from(content)

    return file.load()
  }
}
