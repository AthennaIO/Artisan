/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ejs from 'ejs'

import { join } from 'node:path'
import { File, Folder, Module, String } from '@secjs/utils'

import { Artisan } from '#src/index'
import { AlreadyExistFileException } from '#src/Exceptions/AlreadyExistFileException'

export class TemplateHelper {
  /**
   * The original templates' folder instance of artisan.
   */
  static #originalTemplatesFolder = new Folder(
    join(Module.createDirname(import.meta.url), '..', '..', 'templates'),
  ).loadSync()

  /**
   * The custom templates' files. Use this property to set custom
   * templates' files to use inside Artisan.
   *
   * @type {File[]}
   */
  static #customTemplates = []

  /**
   * Set a custom template file.
   *
   * @param {File} file
   * @return {void}
   */
  static setTemplate(file) {
    if (this.hasTemplate(file)) {
      this.removeTemplate(file)
    }

    this.#customTemplates.push(file)
  }

  /**
   * Set all .ejs files inside folder as templates.
   *
   * @param {Folder} folder
   * @return {void}
   */
  static setAllTemplates(folder) {
    folder.getFilesByPattern('*/**/*.ejs').forEach(file => {
      if (file.extension !== '.js.ejs') {
        return
      }

      this.setTemplate(file)
    })
  }

  /**
   * Verify if template already exists on custom templates'.
   *
   * @param {File} file
   * @return {boolean}
   */
  static hasTemplate(file) {
    return !!this.#customTemplates.find(f => f.base === file.base)
  }

  /**
   * Remove the custom template file.
   *
   * @param {File} file
   * @return {void}
   */
  static removeTemplate(file) {
    if (!this.hasTemplate(file)) {
      return
    }

    const index = this.#customTemplates.findIndex(f => f === file)

    delete this.#customTemplates[index]
  }

  /**
   * Remove all .ejs files inside folders from custom templates.
   *
   * @param {Folder} folder
   * @return {void}
   */
  static removeAllTemplates(folder) {
    folder.getFilesByPattern('*/**/*.ejs').forEach(file => {
      if (file.extension !== '.ejs') {
        return
      }

      this.removeTemplate(file)
    })
  }

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

    const predicate = file => file.base === templateName

    return (
      this.#customTemplates.find(file => predicate(file)) ||
      this.#originalTemplatesFolder.files.find(file => predicate(file))
    )
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
   * @return {Promise<void>}
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
   * Replace the content of the array getter inside a file.
   *
   * @param {string} path
   * @param {string} getter
   * @param {string} importAlias
   * @return {Promise<void>}
   */
  static async replaceArrayGetter(path, getter, importAlias) {
    const file = new File(path).loadSync()
    let content = file.getContentSync().toString()

    const getMethod = `get\\s*${getter}\\(\\)\\s*\\{\\n\\s*return\\s*`

    const matches = content.match(
      new RegExp(`(?:${getMethod})(?:\\[[^\\]]*\\])`),
    )

    if (!matches) {
      return
    }

    const match = matches[0]

    const arrayString = match
      .replace(new RegExp(getMethod), '')
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

    content = content.replace(
      match,
      `get ${getter}() {\n return [${arrayString.join(',')}]`,
    )

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
   * @return {Promise<void>}
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
   * Replace the content of the object getter inside a file.
   *
   * @param {string} path
   * @param {string} getter
   * @param {string} resource
   * @param {string} importAlias
   * @return {Promise<void>}
   */
  static async replaceObjectGetter(path, getter, resource, importAlias) {
    const file = new File(path).loadSync()
    let content = file.getContentSync().toString()

    const getMethod = `get\\s*${getter}\\(\\)\\s*\\{\\n\\s*return\\s*`

    const matches = content.match(new RegExp(`(?:${getMethod})(?:\\{[^}]*\\})`))

    if (!matches) {
      return
    }

    const match = matches[0]

    const arrayString = match
      .replace(new RegExp(getMethod), '')
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

    content = content.replace(
      match,
      `get ${getter}() {\n return {${arrayString.join(',')}}`,
    )

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
