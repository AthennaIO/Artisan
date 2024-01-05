/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'reflect-metadata'

import { Options, String } from '@athenna/common'
import { Annotation } from '#src/helpers/Annotation'
import type { OptionOptions } from '#src/types/OptionOptions'

/**
 * Create an option for a command.
 */
export function Option(options?: OptionOptions): PropertyDecorator {
  return (target: any, key: string | symbol) => {
    key = key.toString()

    options = Options.create(options, {
      isFromGlobal: false,
      signature: `--${String.toDashCase(key)}`
    })

    Annotation.setOption(target, key, options)
  }
}
