/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'reflect-metadata'

import { String } from '@athenna/common'
import { Commander } from '#src/artisan/Commander'
import type { ArgumentOptions, OptionOptions } from '#src/types'
import { CommanderHandler } from '#src/handlers/CommanderHandler'

export class Decorator {
  public static readonly OPTIONS_KEY = 'artisan:options'
  public static readonly ARGUMENTS_KEY = 'artisan:arguments'
  public static readonly COMMANDER_KEY = 'artisan:commander'

  public static getCommander(target: any): Commander {
    if (Reflect.hasMetadata(this.COMMANDER_KEY, target)) {
      return Reflect.getMetadata(this.COMMANDER_KEY, target)
    }

    const Target = target.constructor
    const commander = CommanderHandler.getCommander()

    const command = commander
      .command(Target.signature())
      .description(Target.description())

    Reflect.defineMetadata(this.COMMANDER_KEY, command, target)

    return Reflect.getMetadata(this.COMMANDER_KEY, target)
  }

  public static setOption(
    target: any,
    key: string,
    options: OptionOptions,
  ): typeof Decorator {
    let signatureOption = ''

    if (options.signature.includes('--')) {
      signatureOption = options.signature.split('--')[1]
    }

    if (signatureOption.startsWith('no-')) {
      signatureOption = signatureOption.split('no-')[1]
    }

    signatureOption = signatureOption
      .replace(/<([^)]+)>/g, '')
      .replace(/\[([^)]+)]/g, '')
      .replace(/ /g, '')

    signatureOption = String.toCamelCase(signatureOption)

    if (!Reflect.hasMetadata(this.OPTIONS_KEY, target)) {
      Reflect.defineMetadata(
        this.OPTIONS_KEY,
        { [signatureOption]: key },
        target,
      )
    }

    const metaOptions = Reflect.getMetadata(this.OPTIONS_KEY, target)

    if (metaOptions.signature === signatureOption) {
      return this
    }

    metaOptions[signatureOption] = key

    Reflect.defineMetadata(key, metaOptions, target)

    this.getCommander(target).option(
      options.signature,
      options.description,
      options.default,
    )

    return this
  }

  public static setArgument(
    target: any,
    argument: string,
    options: ArgumentOptions,
  ): typeof Decorator {
    if (!Reflect.hasMetadata(this.ARGUMENTS_KEY, target)) {
      Reflect.defineMetadata(this.ARGUMENTS_KEY, [], target)
    }

    const args = Reflect.getMetadata(this.ARGUMENTS_KEY, target)

    if (args.includes(argument)) {
      return this
    }

    args.push(argument)

    Reflect.defineMetadata(this.ARGUMENTS_KEY, args, target)

    this.getCommander(target).argument(
      options.signature,
      options.description,
      options.default,
    )

    return this
  }

  public static getOptions(target: any): Record<string, any> {
    return Reflect.getMetadata(this.OPTIONS_KEY, target) || {}
  }

  public static getArguments(target: any): string[] {
    return Reflect.getMetadata(this.ARGUMENTS_KEY, target) || []
  }
}
