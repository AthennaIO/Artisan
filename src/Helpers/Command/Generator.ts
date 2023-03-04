/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { View } from '@athenna/view'
import { File, String } from '@athenna/common'
import { resolve, isAbsolute } from 'node:path'
import { AlreadyExistFileException } from '#src/Exceptions/AlreadyExistFileException'

export class Generator {
  private _path: string
  private _template: string
  private _properties: any
  private _setNameProperties = true

  /**
   * Set the file path where the file will be generated.
   * Rememeber that the file name in the path will be used
   * to define the name properties.
   */
  public path(path: string): Generator {
    this._path = path

    return this
  }

  /**
   * Set the template name to be resolved by the
   * athenna/view package.
   */
  public template(name: string): Generator {
    this._template = name

    return this
  }

  /**
   * Set custom properties to exists inside the template.
   */
  public properties(properties: any): Generator {
    this._properties = properties

    return this
  }

  /**
   * Set if generator should set name properties or not. Custom
   * properties will always be the preference. The following
   * properties will exist in templates when using this method:
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
   *   ...properties, // <- Custom properties preference
   * }
   * ```
   */
  public setNameProperties(set: boolean): Generator {
    this._setNameProperties = set

    return this
  }

  /**
   * Make a new file using templates.
   *
   * @example
   * ```ts
   * const path = Path.http(`Controllers/MyController.${Path.ext()}`)
   * const template = 'artisan::controller'
   * const properties = { custom: 'custom-props-for-template' }
   *
   * const file = await this.generator
   *  .path(path)
   *  .template(template)
   *  .properties(properties)
   *  .setNameProperties(true)
   *  .make()
   *
   * this.logger.success(`Controller ({yellow} "${file.name}") successfully created.`)
   * ```
   */
  public async make(): Promise<File> {
    const file = new File(this._path, '')

    if (file.fileExists) {
      throw new AlreadyExistFileException(this._path)
    }

    if (this._setNameProperties) {
      const timestamp = Date.now()
      const nameUp = file.name.toUpperCase()
      const nameCamel = String.toCamelCase(file.name)
      const namePlural = String.pluralize(file.name)
      const namePascal = String.toPascalCase(file.name)
      const namePluralCamel = String.toCamelCase(String.pluralize(file.name))
      const namePluralPascal = String.toPascalCase(String.pluralize(file.name))

      this.properties({
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
        ...this._properties,
      })
    }

    if (View.hasTemplate(this._template)) {
      const content = await View.render(this._template, this._properties)

      return file.setContent(content)
    }

    let templatePath = Config.get(`rc.view.templates.${this._template}`)

    if (!isAbsolute(templatePath)) {
      templatePath = resolve(templatePath)
    }

    const fileTemplate = new File(templatePath)

    View.createTemplate(this._template, await fileTemplate.getContentAsString())

    const content = await View.render(this._template, this._properties)

    return file.setContent(content)
  }
}
