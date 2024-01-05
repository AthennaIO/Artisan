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
import { Annotation } from '#src/helpers/Annotation'
import type { ArgumentOptions } from '#src/types/ArgumentOptions'

/**
 * Create an argument for a command.
 */
export function Argument(options?: ArgumentOptions): PropertyDecorator {
  return (target: any, key: string | symbol) => {
    options = Options.create(options, {
      signature: String(key),
      required: true
    })

    if (options.default) {
      options.required = false
    }

    if (!options.required) {
      options.signature = `[${options.signature}]`
    } else {
      options.signature = `<${options.signature}>`
    }

    Annotation.setArgument(target, String(key), options)
  }
}
