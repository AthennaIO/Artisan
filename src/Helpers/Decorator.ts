/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'reflect-metadata'

import { Commander } from '#src/Artisan/Commander'
import { CommanderHandler } from '#src/Handlers/CommanderHandler'

export class Decorator {
  public static getCommand(target: any, key: string): Commander {
    if (Reflect.hasMetadata(key, target)) {
      return Reflect.getMetadata(key, target)
    }

    const Target = target.constructor
    const commander = CommanderHandler.getCommander()

    const command = commander
      .command(Target.signature())
      .description(Target.description())
      .action(CommanderHandler.bindHandler(target))
      .showHelpAfterError()

    Reflect.defineMetadata(key, command, target)

    return Reflect.getMetadata(key, target)
  }

  public static setOption(
    target: any,
    key: string,
    signature: string,
  ): typeof Decorator {
    let signatureOption = ''
    const metadataKey = 'artisan::options'

    if (signature.includes('--no-')) {
      signatureOption = signature.split('--no-')[1]
    }

    if (signature.includes('--')) {
      signatureOption = signature.split('--')[1]
    }

    signatureOption = signatureOption
      .replace(/<([^)]+)>/g, '')
      .replace(/\[([^)]+)]/g, '')
      .replace(/ /g, '')

    if (!Reflect.hasMetadata(metadataKey, target)) {
      Reflect.defineMetadata(metadataKey, { [signatureOption]: key }, target)
    }

    const options = Reflect.getMetadata(metadataKey, target)

    if (options.signature === signatureOption) {
      return this
    }

    options[signatureOption] = key

    Reflect.defineMetadata(key, options, target)

    return this
  }

  public static setArgument(target: any, argument: string): typeof Decorator {
    const key = 'artisan::arguments'

    if (!Reflect.hasMetadata(key, target)) {
      Reflect.defineMetadata(key, [argument], target)
    }

    const args = Reflect.getMetadata(key, target)

    if (args.includes(argument)) {
      return this
    }

    args.push(argument)

    Reflect.defineMetadata(key, args, target)

    return this
  }
}
