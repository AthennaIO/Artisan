/**
 * @athenna/architect
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { parse } from 'path'
import { existsSync } from 'fs'
import { Command } from '../Command'
import { File, Path } from '@secjs/utils'
import { Command as Commander } from 'commander'
import { Architect } from 'src/Facades/Architect'
import { TemplateHelper } from '../../Utils/TemplateHelper'

export class Middleware extends Command {
  /**
   * The name and signature of the console command.
   */
  protected signature = 'make:middleware <name>'

  /**
   * The console command description.
   */
  protected description = 'Make a new middleware file.'

  /**
   * Execute the console command.
   *
   * @return {Promise<void>}
   */
  async handle(name: string, options: any): Promise<void> {
    // TODO Add middleware to namedMiddlewares object of HttpKernel

    this.simpleLog('[ MAKING MIDDLEWARE ]', 'bold', 'green')

    name = TemplateHelper.normalizeName(name, 'Middleware')
    const template = TemplateHelper.getTemplate('__name__Middleware', options)

    if (!template) {
      this.error(
        `Template for extension ({yellow} "${options.extension}") has not been found.`,
      )

      return
    }

    const replacedName = TemplateHelper.replaceTemplateName(name, template.base)
    const path = Path.app(`Http/Middlewares/${replacedName}`)
    const content = TemplateHelper.replaceTemplateValues(
      name,
      template.getContentSync(),
    )

    if (existsSync(path)) {
      this.error(
        `The middleware ({yellow} "${
          parse(path).name
        }") already exists. Try using another name.`,
      )

      return
    }

    const middleware = await new File(path, content).create()

    this.success(
      `Middleware ({yellow} "${middleware.name}") successfully created.`,
    )

    if (options.lint) {
      await Architect.call(
        `eslint:fix ${middleware.path} --resource Middleware`,
      )
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
      .option('--no-lint', 'Do not run eslint in the middleware', true)
  }
}
