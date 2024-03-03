/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { View } from '@athenna/view'
import { Path, File, String } from '@athenna/common'
import { sep, resolve, isAbsolute } from 'node:path'
import { AlreadyExistFileException } from '#src/exceptions/AlreadyExistFileException'

export class Generator {
  private _path: string
  private _fileName: string
  private _dest: string
  private _ext = Path.ext()
  private _template: string
  private _properties: any
  private _setNameProperties = true

  /**
   * Set the file path where the file will be generated.
   * Remember that the file name in the path will be used
   * to define the name properties.
   *
   * If defining a path, `fileName()`, `destination()` and
   * `extension()` will be ignored.
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
   * Set the name of the file that will be generated
   * and use as reference to define the name properties.
   */
  public fileName(name: string) {
    this._fileName = name

    return this
  }

  /**
   * Set the destination where the file should be generated.
   *
   * @example
   * ```ts
   * this.generator
   *  .name('UserController')
   *  .destination(Path.controllers())
   * ```
   */
  public destination(dest: string) {
    if (!isAbsolute(dest)) {
      dest = resolve(Path.pwd(), dest)
    }

    this._dest = dest

    return this
  }

  /**
   * Set the file extension.
   *
   * @example
   * ```ts
   * this.generator
   *  .name('UserController')
   *  .extension('ts')
   *  .destination(Path.controllers())
   * ```
   */
  public extension(ext: string) {
    this._ext = ext

    return this
  }

  /**
   * Get the signature that will be used as key
   * to be defined in `.athennarc.json` file.
   *
   * Only works when defining `fileName()`.
   *
   * @example
   * ```ts
   * this.generator.fileName('user.controller')
   *
   * const name = this.generator.getSignature()
   *
   * // userController
   * ```
   */
  public getSignature(): string {
    return String.toCamelCase(this._fileName)
  }

  /**
   * Create a sub path import path for the file
   * from the destination defined and the
   * file name.
   *
   * Only works when defining `destination()` and
   * `name()`.
   *
   * @example
   * ```ts
   * this.generator
   *   .fileName('UserController')
   *   .destination(Path.controllers())
   *
   * const importPath = this.generator.getImportPath()
   *
   * /// #app/http/controllers/UserController
   * ```
   */
  public getImportPath(): string {
    return `${this._dest
      .replace(Path.pwd(), '')
      .replace(/\\/g, '/')
      .replace('/', '#')}/${this._fileName}`
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
    if (!this._path) {
      this._path = this._dest.concat(`${sep}${this._fileName}.${this._ext}`)
    }

    const file = new File(this._path, '')

    if (file.fileExists) {
      throw new AlreadyExistFileException(this._path)
    }

    if (!this._fileName) {
      this._fileName = file.name
    }

    if (this._setNameProperties) {
      const timestamp = Date.now()
      const nameUp = this._fileName.toUpperCase()
      const nameCamel = String.toCamelCase(this._fileName)
      const namePlural = String.pluralize(this._fileName)
      const namePascal = String.toPascalCase(this._fileName)
      const namePluralCamel = String.toCamelCase(
        String.pluralize(this._fileName)
      )
      const namePluralPascal = String.toPascalCase(
        String.pluralize(this._fileName)
      )

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
        ...this._properties
      })
    }

    if (View.hasTemplate(this._template)) {
      const content = await View.render(this._template, this._properties)

      return file.setContent(content)
    }

    const templates = Config.get('rc.templates')

    // Avoid problems when user define template
    // key with dot notation.
    let templatePath = templates[this._template]

    if (!isAbsolute(templatePath)) {
      templatePath = resolve(templatePath)
    }

    const content = await View.renderRawByPath(templatePath, this._properties)

    return file.setContent(content)
  }
}
