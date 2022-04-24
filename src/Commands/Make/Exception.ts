/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { existsSync } from 'fs'
import { File, Path } from '@secjs/utils'
import { Artisan } from 'src/Facades/Artisan'
import { Command } from 'src/Commands/Command'
import { Commander } from 'src/Contracts/Commander'
import { TemplateHelper } from 'src/Utils/TemplateHelper'
import { AlreadyExistFileException } from 'src/Exceptions/AlreadyExistFileException'
import { TemplateNotFoundException } from 'src/Exceptions/TemplateNotFoundException'

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
    this.simpleLog('[ MAKING EXCEPTION ]\n', 'rmNewLineStart', 'bold', 'green')

    name = TemplateHelper.normalizeName(name, 'Exception')
    const template = TemplateHelper.getTemplate('__name__Exception', options)

    if (!template) {
      throw new TemplateNotFoundException(options.extension)
    }

    const replacedName = TemplateHelper.replaceTemplateName(name, template.base)
    const path = Path.app(`Exceptions/${replacedName}`)
    const content = TemplateHelper.replaceTemplateValues(
      name,
      template.getContentSync(),
    )

    if (existsSync(path)) {
      throw new AlreadyExistFileException('exception', path)
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
