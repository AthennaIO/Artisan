/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'reflect-metadata'

import { debug } from '#src/debug'
import { String } from '@athenna/common'
import type { ArgumentOptions, OptionOptions } from '#src/types'
import { OPTIONS_KEY, ARGUMENTS_KEY } from '#src/constants/MetadataKeys'

export type OptionsMeta = { key: string; signatureName: string } & OptionOptions
export type ArgumentMeta = {
  key: string
  signatureName: string
} & ArgumentOptions

export class Annotation {
  public static setOption(
    target: any,
    key: string,
    options: OptionOptions
  ): typeof Annotation {
    const optionMeta = {
      key,
      signatureName: options.signature,
      ...options
    }

    if (optionMeta.signatureName.includes('--')) {
      optionMeta.signatureName = optionMeta.signatureName.split('--')[1]
    }

    if (optionMeta.signatureName.startsWith('no-')) {
      optionMeta.signatureName = optionMeta.signatureName.split('no-')[1]
    }

    optionMeta.signatureName = String.toCamelCase(
      optionMeta.signatureName
        .replace(/<([^)]+)>/g, '')
        .replace(/\[([^)]+)]/g, '')
        .replace(/ /g, '')
    )

    const opts = this.getOptions(target)

    debug('Registering option %o', {
      target,
      ...optionMeta
    })

    opts.push(optionMeta)

    Reflect.defineMetadata(OPTIONS_KEY, opts, target)

    return this
  }

  public static setArgument(
    target: any,
    key: string,
    argument: ArgumentOptions
  ): typeof Annotation {
    const args = this.getArguments(target)
    const argumentMeta = {
      key,
      signatureName: argument.signature
        .replace(/[[\]']+/g, '')
        .replace(/[<>']+/g, ''),
      ...argument
    }

    debug('Registering argument %o', {
      target,
      ...argumentMeta
    })

    args.push(argumentMeta)

    Reflect.defineMetadata(ARGUMENTS_KEY, args, target)

    return this
  }

  public static getOptions(target: any): OptionsMeta[] {
    if (!Reflect.hasMetadata(OPTIONS_KEY, target)) {
      Reflect.defineMetadata(OPTIONS_KEY, [], target)
    }

    return Reflect.getMetadata(OPTIONS_KEY, target)
  }

  public static getArguments(target: any): ArgumentMeta[] {
    if (!Reflect.hasMetadata(ARGUMENTS_KEY, target)) {
      Reflect.defineMetadata(ARGUMENTS_KEY, [], target)
    }

    return Reflect.getMetadata(ARGUMENTS_KEY, target)
  }
}
