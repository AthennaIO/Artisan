/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'reflect-metadata'

import { Artisan } from '#src/Facades/Artisan'
import { Options, String } from '@athenna/common'
import { CommandOptions } from '#src/Types/CommandOptions'

/**
 * Create a command inside the service provider.
 */
export function Command(options?: CommandOptions): ClassDecorator {
  return (target: any) => {
    options = Options.create(options, {
      alias: `App/Console/Commands/${target.name}`,
      type: 'singleton',
    })

    const alias = options.alias
    const createCamelAlias = true
    const camelTargetName = String.toCamelCase(target.name)

    if (ioc.hasDependency(alias) || ioc.hasDependency(camelTargetName)) {
      return
    }

    const command = ioc[options.type](alias, target, createCamelAlias).safeUse(
      alias,
    )

    Artisan.register(command)
  }
}
