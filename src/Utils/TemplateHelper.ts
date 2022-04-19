/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ejs from 'ejs'

import { join } from 'path'
import { Artisan } from 'src/Facades/Artisan'
import { File, Folder, String } from '@secjs/utils'

export class TemplateHelper {
  /**
   * The templates' folder instance of artisan.
   *
   * @private
   */
  private static templatesFolder = new Folder(
    join(__dirname, '..', '..', 'templates'),
  ).loadSync()

  /**
   * Normalize the resource name removing duplicated.
   *
   * @param templateName
   * @param options
   */
  static normalizeName(name: string, resource: string): string {
    const resourcePlural = String.pluralize(resource)

    if (name.includes(resource)) {
      return name.split(resource)[0]
    }

    if (name.includes(resourcePlural)) {
      return name.split(resourcePlural)[0]
    }

    return name
  }

  /**
   * Get the template file by name or undefined.
   *
   * @param templateName
   * @param options
   */
  static getTemplate(templateName: string, options: any): File {
    templateName = `${templateName}.${options.extension}.ejs`

    return this.templatesFolder.files.find(f => f.base === templateName) as File
  }

  /**
   * Replace the name of the template file with values.
   *
   * @param name
   * @param baseTemplateName
   */
  static replaceTemplateName(name: string, baseTemplateName: string): string {
    return baseTemplateName
      .replace('.ejs', '')
      .replace('__name__', name)
      .replace('__name_low__', name.toLowerCase())
      .replace('__name_plural__', String.pluralize(name))
      .replace('__name_plural_low__', String.pluralize(name).toLowerCase())
  }

  /**
   * Replace the values inside the template file using ejs.
   *
   * @param name
   * @param templateContent
   */
  static replaceTemplateValues(name: string, templateContent: Buffer): Buffer {
    const templateString = ejs.render(templateContent.toString(), {
      nameUp: name.toUpperCase(),
      nameCamel: String.toCamelCase(name),
      namePlural: String.pluralize(name),
      namePascal: String.toPascalCase(name),
      namePluralCamel: String.toCamelCase(String.pluralize(name)),
      namePluralPascal: String.toPascalCase(String.pluralize(name)),
    })

    return Buffer.from(templateString)
  }

  /**
   * Replace the content of the array property inside a file.
   *
   * @param path
   * @param matcher
   * @param importAlias
   */
  static async replaceArrayProperty(
    path: string,
    matcher: string,
    importAlias: string,
  ) {
    const file = new File(path).loadSync()
    let content = file.getContentSync().toString()

    const regex = new RegExp(
      `(?:${matcher.replace(' ', '\\s*')}\\s*)(?:\\[[^}]*\\])`,
    )

    const matches = content.match(regex)

    if (!matches) {
      return
    }

    const match = matches[0]

    const arrayString = match
      .replace(/ /g, '')
      .replace(/\n/g, '')
      .replace(matcher, '')
      .replace(/(\[|\])/g, '')
      .split(',')

    /**
     * In case "matcher" is an empty array.
     * Example: "matcher" = []
     */
    if (arrayString.length) {
      const last = () => arrayString.length - 1

      if (arrayString[last()] === '') {
        arrayString.pop()
      }
    }

    arrayString.push(`import('${importAlias}')`)

    content = content.replace(match, `${matcher}[${arrayString.join(',')}]`)

    await file.remove()
    await new File(file.path, Buffer.from(content)).create()

    await Artisan.call(
      `eslint:fix ${file.path} --resource TemplateHelper --quiet`,
    )
  }

  /**
   * Replace the content of the object property inside a file.
   *
   * @param path
   * @param matcher
   * @param resource
   * @param importAlias
   */
  static async replaceObjectProperty(
    path: string,
    matcher: string,
    resource: string,
    importAlias: string,
  ) {
    const file = new File(path).loadSync()
    let content = file.getContentSync().toString()

    const matches = content.match(
      new RegExp(`(?:${matcher.replace(' ', '\\s*')}\\s*)(?:\\{[^}]*\\})`),
    )

    if (!matches) {
      return
    }

    const match = matches[0]

    const arrayString = match
      .replace(/ /g, '')
      .replace(/\n/g, '')
      .replace(matcher, '')
      .replace(/(\{|\})/g, '')
      .split(',')

    /**
     * In case "matcher" is an empty object.
     * Example: "matcher" = {}
     */
    if (arrayString.length) {
      const last = () => arrayString.length - 1

      if (arrayString[last()] === '') {
        arrayString.pop()
      }
    }

    const name = file.name.split(resource)[0].toLowerCase()

    arrayString.push(`${name}:import('${importAlias}')`)

    content = content.replace(match, `${matcher}{${arrayString.join(',')}}`)

    await file.remove()
    await new File(file.path, Buffer.from(content)).create()

    await Artisan.call(
      `eslint:fix ${file.path} --resource TemplateHelper --quiet`,
    )
  }
}
