/**
 * @athenna/architect
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import chalk from 'chalk'

import { parse } from 'path'
import { existsSync } from 'fs'
import { Command } from '../Command'
import { Log } from '@athenna/logger'
import { File, Path } from '@secjs/utils'
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

    process.stdout.write(chalk.bold.green('[ MAKING MIDDLEWARE ]\n'))

    name = TemplateHelper.normalizeName(name, 'Middleware')
    const template = TemplateHelper.getTemplate('__name__Middleware', options)

    if (!template) {
      Log.error(
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
      Log.error(
        `The middleware ({yellow} "${
          parse(path).name
        }") already exists. Try using another name.`,
      )

      return
    }

    const middleware = await new File(path, content).create()

    Log.success(
      `Middleware ({yellow} "${middleware.name}") successfully created.`,
    )

    if (options.lint) {
      await TemplateHelper.runEslintOnFile('Middleware', middleware.path)
    }
  }
}
