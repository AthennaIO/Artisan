/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ejs from 'ejs'

import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import { Artisan } from '#src/index'
import { File, Folder, String } from '@secjs/utils'
import { AlreadyExistFileException } from '#src/Exceptions/AlreadyExistFileException'

const __dirname = dirname(fileURLToPath(import.meta.url))

export class TemplateHelper {
  /**
   * The templates' folder instance of artisan.
   */
  static #templatesFolder = new Folder(
    join(__dirname, '..', '..', 'templates'),
  ).loadSync()

  /**
   * Normalize the resource name removing duplicated.
   *
   * @param {string} name
   * @param {string} resource
   * @return {string}
   */
  static normalizeName(name, resource) {
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
   * @param {string} templateName
   * @return {File}
   */
  static getTemplate(templateName) {
    templateName = `${templateName}.js.ejs`

    return this.#templatesFolder.files.find(f => f.base === templateName)
  }

  /**
   * Replace the name of the template file with values.
   *
   * @param {string} name
   * @param {string} baseTemplateName
   * @return {string}
   */
  static replaceTemplateName(name, baseTemplateName) {
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
   * @param {string} name
   * @param {Buffer} templateContent
   * @return {Buffer}
   */
  static replaceTemplateValues(name, templateContent) {
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
   * @param {string} path
   * @param {string} matcher
   * @param {string} importAlias
   */
  static async replaceArrayProperty(path, matcher, importAlias) {
    const file = new File(path).loadSync()
    let content = file.getContentSync().toString()

    const matches = content.match(
      new RegExp(`(?:${matcher.replace(' ', '\\s*')}\\s*)(?:\\[[^\\]]*\\])`),
    )

    if (!matches) {
      return
    }

    const match = matches[0]

    const arrayString = match
      .replace(matcher, '')
      .replace(/ /g, '')
      .replace(/\n/g, '')
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
    await new File(file.path, Buffer.from(content)).load()

    await Artisan.call(
      `eslint:fix ${file.path} --resource TemplateHelper --quiet`,
    )
  }

  /**
   * Replace the content of the object property inside a file.
   *
   * @param {string} path
   * @param {string} matcher
   * @param {string} resource
   * @param {string} importAlias
   */
  static async replaceObjectProperty(path, matcher, resource, importAlias) {
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
      .replace(matcher, '')
      .replace(/ /g, '')
      .replace(/\n/g, '')
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

    const name = String.toCamelCase(resource)

    arrayString.push(`${name}:import('${importAlias}')`)

    content = content.replace(match, `${matcher}{${arrayString.join(',')}}`)

    await file.remove()
    await new File(file.path, Buffer.from(content)).load()

    await Artisan.call(
      `eslint:fix ${file.path} --resource TemplateHelper --quiet`,
    )
  }

  /**
   * Create a new file from resource.
   *
   * @param {string} name
   * @param {string} resource
   * @param {string} subPath
   * @return {Promise<File>}
   */
  static async getResourceFile(name, resource, subPath) {
    name = TemplateHelper.normalizeName(name, resource)
    const template = TemplateHelper.getTemplate(`__name__${resource}`)

    const replacedName = TemplateHelper.replaceTemplateName(name, template.base)
    const path = subPath.concat('/', replacedName)
    const content = TemplateHelper.replaceTemplateValues(
      name,
      template.getContentSync(),
    )

    if (await File.exists(path)) {
      throw new AlreadyExistFileException('controller', path)
    }

    return new File(path, content).load()
  }
}
