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
import { Command as Commander } from 'commander'
import { TemplateHelper } from 'src/Utils/TemplateHelper'

export class Provider extends Command {
  /**
   * The name and signature of the console command.
   */
  protected signature = 'make:provider <name>'

  /**
   * The console command description.
   */
  protected description = 'Make a new provider file.'

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
        'Do not register the provider inside config/app file',
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
    this.simpleLog('[ MAKING PROVIDER ]', 'rmNewLineStart', 'bold', 'green')

    name = TemplateHelper.normalizeName(name, 'Provider')
    const template = TemplateHelper.getTemplate('__name__Provider', options)

    if (!template) {
      this.error(
        `Template for extension ({yellow} "${options.extension}") has not been found.`,
      )

      return
    }

    const replacedName = TemplateHelper.replaceTemplateName(name, template.base)
    const path = Path.providers(replacedName)
    const content = TemplateHelper.replaceTemplateValues(
      name,
      template.getContentSync(),
    )

    if (existsSync(path)) {
      this.error(
        `The provider ({yellow} "${
          parse(path).name
        }") already exists. Try using another name.`,
      )

      return
    }

    const provider = await new File(path, content).create()

    this.success(`Provider ({yellow} "${provider.name}") successfully created.`)

    if (options.lint) {
      await Artisan.call(`eslint:fix ${provider.path} --resource Provider`)
    }

    if (options.register) {
      await TemplateHelper.replaceArrayProperty(
        Path.config(`app.${options.extension}`),
        'providers:',
        `Providers/${provider.name}`,
      )
    }
  }
}
