/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'reflect-metadata'

import { Options } from '@athenna/common'
import { Decorator } from '#src/Helpers/Decorator'
import { ArgumentOptions } from '#src/Types/ArgumentOptions'

/**
 * Create an argument for a command.
 */
export function Argument(options?: ArgumentOptions): PropertyDecorator {
  return (target: any, key: string | symbol) => {
    options = Options.create(options, {
      name: String(key),
      required: true,
    })

    if (!options.required) {
      options.name = `[${options.name}]`
    }

    const commander = Decorator.setArgument(target, options.name).getCommand(
      target,
      'artisan::commander',
    )

    commander.argument(options.name, options.description, options.default)
  }
}
