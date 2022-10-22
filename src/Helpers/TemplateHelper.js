import { Edge } from 'edge.js'

import { File, Folder, String } from '@athenna/common'
import { AlreadyExistFileException } from '#src/Exceptions/AlreadyExistFileException'
import { NotFoundTemplateException } from '#src/Exceptions/NotFoundTemplateException'

export class TemplateHelper {
  /**
   * All templates set to Artisan work with.
   *
   * @type {File[]}
   */
  templates = []

  /**
   * Custom properties to set when fabricating templates.
   *
   * @type {any}
   */
  customProperties = {}

  /**
   * Edge template engine instance.
   *
   * @type {Edge}
   */
  edge = null

  /**
   * Creates a new instance of TemplateHelper
   *
   * @return {TemplateHelper}
   */
  constructor() {
    this.edge = new Edge({ cache: false })
  }

  /**
   * Verify if template exists by name.
   *
   * @param name {string}
   * @return {boolean}
   */
  hasTemplate(name) {
    return !!this.templates.find(f => f.name === name)
  }

  /**
   * Add new template or subscribe an existent one.
   *
   * @param path {string}
   * @return {void}
   */
  addTemplate(path) {
    const file = new File(path).loadSync({ withContent: false })

    if (this.hasTemplate(file.name)) {
      this.removeTemplate(file.name)
    }

    this.templates.push(file)
  }

  /**
   * Add templates in folder or subscribe the existent.
   *
   * @param path {string}
   * @return {void}
   */
  addTemplates(path) {
    const folder = new Folder(path).loadSync({ withFileContent: false })

    folder.files.forEach(file => this.addTemplate(file.path))
  }

  /**
   * Add template file or subscribe the existent.
   *
   * @param file {File}
   * @return {void}
   */
  addTemplateFile(file) {
    if (this.hasTemplate(file.name)) {
      this.removeTemplate(file.name)
    }

    this.templates.push(file)
  }

  /**
   * Add templates in folder or subscribe the existent.
   *
   * @param files {File[]}
   * @return {void}
   */
  addTemplatesFiles(files) {
    files.forEach(file => this.addTemplateFile(file))
  }

  /**
   * Get the template file by name.
   *
   * @param {string} name
   * @return {File}
   */
  getTemplate(name) {
    const template = this.templates.find(file => file.name === name)

    if (!template) {
      throw new NotFoundTemplateException(name)
    }

    return template
  }

  /**
   * Remove the template by name.
   *
   * @param name {string}
   * @return {void}
   */
  removeTemplate(name) {
    if (!this.hasTemplate(name)) {
      return
    }

    const index = this.templates.findIndex(f => f.name === name)

    this.templates.splice(index, 1)
  }

  /**
   * Remove the templates by names.
   *
   * @param names {string}
   * @return {void}
   */
  removeTemplates(...names) {
    names.forEach(name => this.removeTemplate(name))
  }

  /**
   * Set custom template properties.
   *
   * @param key {string}
   * @param value {any}
   * @return {void}
   */
  addProperty(key, value) {
    this.customProperties[key] = value
  }

  /**
   * Remove the custom template property.
   *
   * @param key {string}
   * @return {void}
   */
  removeProperty(key) {
    if (!this.customProperties[key]) {
      return
    }

    delete this.customProperties[key]
  }

  /**
   * Get template params to render in templates.
   *
   * @param name {string}
   * @return {any}
   */
  getTemplateParams(name) {
    const timestamp = Date.now()

    const nameUp = name.toUpperCase()
    const nameCamel = String.toCamelCase(name)
    const namePlural = String.pluralize(name)
    const namePascal = String.toPascalCase(name)
    const namePluralCamel = String.toCamelCase(String.pluralize(name))
    const namePluralPascal = String.toPascalCase(String.pluralize(name))

    return {
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
      ...this.customProperties,
    }
  }

  /**
   * Fabricate the file by templateName.
   *
   * @param templateName {string}
   * @param filePath {string}
   * @return {Promise<File>}
   */
  async fabricate(templateName, filePath) {
    if (await File.exists(filePath)) {
      throw new AlreadyExistFileException(filePath)
    }

    const file = new File(filePath, Buffer.from(''))
    const template = await this.getTemplate(templateName).getContent()

    const state = this.getTemplateParams(file.name)
    const content = await this.edge.renderRaw(template.toString(), state)

    return new File(filePath, Buffer.from(content)).load()
  }
}
