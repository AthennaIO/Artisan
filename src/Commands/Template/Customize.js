/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path, Module } from '@athenna/common'

import { Command } from '#src/index'

export class TemplateCustomize extends Command {
  /**
   * The name and signature of the console command.
   *
   * @return {string}
   */
  get signature() {
    return 'template:customize'
  }

  /**
   * The console command description.
   *
   * @return {string}
   */
  get description() {
    return 'Creates a folder called templates in your project root with all templates of Athenna.'
  }

  /**
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @param {import('#src/index').Commander} commander
   * @return {import('#src/index').Commander}
   */
  addFlags(commander) {
    return commander
  }

  /**
   * Execute the console command.
   *
   * @return {Promise<void>}
   */
  async handle() {
    this.title('MOVING TEMPLATES\n', 'bold', 'green')

    const Kernel = await Module.getFrom(Path.console(`Kernel.${Path.ext()}`))

    const kernel = new Kernel()

    const promises = kernel.templates.map(template => {
      if (template.path.includes('resources/templates')) {
        return null
      }

      return template.copy(Path.resources(`templates/${template.base}`))
    })

    await Promise.all(promises)

    this.success(
      'Template files successfully moved to ({yellow} resources/templates) folder.',
    )
  }
}
