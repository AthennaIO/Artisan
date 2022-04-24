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
import { Commander } from 'src/Contracts/Commander'
import { TemplateHelper } from 'src/Utils/TemplateHelper'
import { Command as AbstractCommand } from 'src/Commands/Command'
import { AlreadyExistFileException } from 'src/Exceptions/AlreadyExistFileException'
import { TemplateNotFoundException } from 'src/Exceptions/TemplateNotFoundException'

export class Command extends AbstractCommand {
  /**
   * The name and signature of the console command.
   */
  protected signature = 'make:command <name>'

  /**
   * The console command description.
   */
  protected description = 'Make a new command file.'

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
      .option(
        '--no-register',
        'Do not register the command inside Kernel',
        true,
      )
      .option('--no-lint', 'Do not run eslint in the middleware', true)
  }

  /**
   * Execute the console command.
   *
   * @return {Promise<void>}
   */
  async handle(name: string, options: any): Promise<void> {
    this.simpleLog('[ MAKING COMMAND ]', 'rmNewLineStart', 'bold', 'green')

    name = TemplateHelper.normalizeName(name, 'Command')
    const template = TemplateHelper.getTemplate('__name__Command', options)

    if (!template) {
      throw new TemplateNotFoundException(options.extension)
    }

    const replacedName = TemplateHelper.replaceTemplateName(name, template.base)
    const path = Path.app(`Console/Commands/${replacedName}`)
    const content = TemplateHelper.replaceTemplateValues(
      name,
      template.getContentSync(),
    )

    if (existsSync(path)) {
      throw new AlreadyExistFileException('command', path)
    }

    const command = await new File(path, content).create()

    this.success(`Command ({yellow} "${command.name}") successfully created.`)

    if (options.lint) {
      await Artisan.call(`eslint:fix ${command.path} --resource Command`)
    }

    if (options.register) {
      await TemplateHelper.replaceArrayProperty(
        Path.app(`Console/Kernel.${options.extension}`),
        'commands =',
        `App/Console/Commands/${command.name}`,
      )
    }
  }
}
