/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseCommand } from '#src'
import { File } from '@athenna/common'

export class TemplateCustomizeCommand extends BaseCommand {
  public static signature(): string {
    return 'template:customize'
  }

  public static description(): string {
    return 'Export all the templates files of Athenna to the "resources/templates" path.'
  }

  public async handle(): Promise<void> {
    this.logger.simple('({bold,green} [ MOVING TEMPLATES ])\n')

    const paths = Config.get('view.templates.paths')

    const promises = Object.keys(paths).map(key => {
      const path = paths[key]

      if (path.includes('resources/templates')) {
        return null
      }

      const file = new File(path)

      return file.copy(Path.resources(`templates/${file.base}`))
    })

    await Promise.all(promises)

    this.logger.success(
      'Template files successfully moved to ({yellow} "resources/templates") folder.',
    )
  }
}
