/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { join } from 'node:path'
import { Path, Module, Folder } from '@secjs/utils'

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
   * @param {import('commander').Command} commander
   * @return {import('commander').Command}
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
    this.simpleLog(`[ MOVING TEMPLATES ]`, 'rmNewLineStart', 'bold', 'green')

    const Kernel = await Module.getFrom(Path.console('Kernel.js'))

    const kernel = new Kernel()

    const templates = [
      ...new Folder(
        join(
          Module.createDirname(import.meta.url),
          '..',
          '..',
          '..',
          'templates',
        ),
      ).loadSync().files,
      ...kernel.templates,
    ]

    const promises = templates.map(t => t.copy(Path.pwd(`templates/${t.base}`)))

    await Promise.all(promises)

    this.success('Template files successfully moved.')
  }
}
