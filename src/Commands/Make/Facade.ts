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

export class Facade extends Command {
  /**
   * The name and signature of the console command.
   */
  protected signature = 'make:facade <name>'

  /**
   * The console command description.
   */
  protected description = 'Make a new facade file.'

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
      .option('--no-lint', 'Do not run eslint in the facade', true)
  }

  /**
   * Execute the console command.
   *
   * @return {Promise<void>}
   */
  async handle(name: string, options: any): Promise<void> {
    this.simpleLog('[ MAKING FACADE ]', 'rmNewLineStart', 'bold', 'green')

    const template = TemplateHelper.getTemplate('__name__Facade', options)

    if (!template) {
      throw new TemplateNotFoundException(options.extension)
    }

    const replacedName = TemplateHelper.replaceTemplateName(
      name,
      template.base,
    ).replace('Facade', '')
    const path = Path.providers(`Facades/${replacedName}`)
    const content = TemplateHelper.replaceTemplateValues(
      name,
      template.getContentSync(),
    )

    if (existsSync(path)) {
      throw new AlreadyExistFileException('facade', path)
    }

    const facade = await new File(path, content).create()

    this.success(`Facade ({yellow} "${facade.name}") successfully created.`)
    this.success(
      `Run ({yellow} "node artisan make:provider ${facade.name}Provider") to bind your dependency inside the service container.`,
    )

    if (options.lint) {
      await Artisan.call(`eslint:fix ${facade.path} --resource Facade`)
    }
  }
}
