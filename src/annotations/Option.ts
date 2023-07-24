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
import { Decorator } from '#src/helpers/Decorator'
import type { OptionOptions } from '#src/types/OptionOptions'

/**
 * Create an option for a command.
 */
export function Option(options?: OptionOptions): PropertyDecorator {
  return (target: any, key: string | symbol) => {
    options = Options.create(options, {
      signature: `--${String(key)}`,
    })

    Decorator.setOption(target, String(key), options)
  }
}
