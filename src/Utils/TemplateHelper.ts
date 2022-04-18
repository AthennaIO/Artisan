/**
 * @athenna/architect
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ejs from 'ejs'

import { join, parse } from 'path'
import { Log } from '@athenna/logger'
import { runCommand } from './runCommand'
import { File, Folder, String } from '@secjs/utils'

export class TemplateHelper {
  /**
   * The templates' folder instance of architect.
   *
   * @private
   */
  private static templatesFolder = new Folder(
    join(__dirname, '..', '..', 'templates'),
  ).loadSync()

  /**
   * Run eslint in files generated by make command.
   *
   * @param resource
   * @param filePath
   */
  static async runEslintOnFile(resource: string, filePath: string) {
    const { name } = parse(filePath)

    try {
      await runCommand(`./node_modules/.bin/eslint ${filePath} --fix --quiet`)

      Log.success(`${resource} ({yellow} "${name}") successfully linted.`)
    } catch (error) {
      Log.error(
        `Failed to lint ${resource} ({yellow} "${name}"). Please check your eslint configurations.`,
      )
    }
  }

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
}
