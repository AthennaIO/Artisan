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
import { Command } from 'src/Commands/Command'
import { Command as Commander } from 'commander'
import { Artisan } from 'src/Facades/Artisan'
import { TemplateHelper } from 'src/Utils/TemplateHelper'

export class Controller extends Command {
  /**
   * The name and signature of the console command.
   */
  protected signature = 'make:controller <name>'

  /**
   * The console command description.
   */
  protected description = 'Make a new controller file.'

  /**
   * Execute the console command.
   *
   * @return {Promise<void>}
   */
  async handle(name: string, options: any): Promise<void> {
    this.simpleLog('[ MAKING CONTROLLER ]', 'bold', 'green')

    name = TemplateHelper.normalizeName(name, 'Controller')
    const template = TemplateHelper.getTemplate('__name__Controller', options)

    if (!template) {
      this.error(
        `Template for extension ({yellow} "${options.extension}") has not been found.`,
      )

      return
    }

    const replacedName = TemplateHelper.replaceTemplateName(name, template.base)
    const path = Path.app(`Http/Controllers/${replacedName}`)
    const content = TemplateHelper.replaceTemplateValues(
      name,
      template.getContentSync(),
    )

    if (existsSync(path)) {
      this.error(
        `The controller ({yellow} "${
          parse(path).name
        }") already exists. Try using another name.`,
      )

      return
    }

    const controller = await new File(path, content).create()

    this.success(
      `Controller ({yellow} "${controller.name}") successfully created.`,
    )

    if (options.lint) {
      await Artisan.call(`eslint:fix ${controller.path} --resource Controller`)
    }
  }

  /**
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @return {void}
   */
  protected setFlags(commander: Commander): Commander {
    return commander
      .option(
        '-e, --extension <extension>',
        'Current extension available: ts',
        'ts',
      )
      .option('--no-lint', 'Do not run eslint in the controller', true)
  }
}
