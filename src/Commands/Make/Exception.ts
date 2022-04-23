/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { parse } from 'path'
import { existsSync } from 'fs'
import { File, Path } from '@secjs/utils'
import { Artisan } from 'src/Facades/Artisan'
import { Command } from 'src/Commands/Command'
import { Commander } from 'src/Contracts/Commander'
import { TemplateHelper } from 'src/Utils/TemplateHelper'

export class Exception extends Command {
  /**
   * The name and signature of the console command.
   */
  protected signature = 'make:exception <name>'

  /**
   * The console command description.
   */
  protected description = 'Make a new exception file.'

  /**
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @return {void}
   */
  public addFlags(commander: Commander): Commander {
    return commander
      .option(
        '-e, --extension <extension>',
        'Current extension available: ts',
        'ts',
      )
      .option('--no-lint', 'Do not run eslint in the exception', true)
  }

  /**
   * Execute the console command.
   *
   * @return {Promise<void>}
   */
  async handle(name: string, options: any): Promise<void> {
    this.simpleLog('[ MAKING EXCEPTION ]', 'rmNewLineStart', 'bold', 'green')

    name = TemplateHelper.normalizeName(name, 'Exception')
    const template = TemplateHelper.getTemplate('__name__Exception', options)

    if (!template) {
      this.error(
        `Template for extension ({yellow} "${options.extension}") has not been found.`,
      )

      return
    }

    const replacedName = TemplateHelper.replaceTemplateName(name, template.base)
    const path = Path.app(`Exceptions/${replacedName}`)
    const content = TemplateHelper.replaceTemplateValues(
      name,
      template.getContentSync(),
    )

    if (existsSync(path)) {
      this.error(
        `The exception ({yellow} "${
          parse(path).name
        }") already exists. Try using another name.`,
      )

      return
    }

    const exception = await new File(path, content).create()

    this.success(
      `Exception ({yellow} "${exception.name}") successfully created.`,
    )

    if (options.lint) {
      await Artisan.call(`eslint:fix ${exception.path} --resource Exception`)
    }
  }
}
