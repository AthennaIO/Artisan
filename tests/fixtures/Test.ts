/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Argument, Option } from '#src'
import { BaseCommand } from '#src/artisan/BaseCommand'

export class Test extends BaseCommand {
  @Argument()
  public requiredArg: string

  @Option({
    signature: '-o, --other',
    description: 'Option.'
  })
  public option: string

  @Option({
    signature: '-oo, --otherOption',
    default: 'notRequiredOption',
    description: 'Other option.'
  })
  public notRequiredOption: string

  @Argument({
    required: false,
    default: 'notRequiredArg',
    description: 'Not required arg.'
  })
  public notRequiredArg: string

  @Option({
    signature: '--no-clean'
  })
  public any___VALLLUE: boolean

  @Option({
    signature: '--ignore-on-clean [folders]',
    description: 'Ignore the given folders when cleaning the application.',
    default: 'tests|node_modules'
  })
  public ignoreOnClean: string

  @Option({
    signature: '--ignore-on-clean-array [folders...]',
    description: 'Ignore the given folders when cleaning the application.',
    default: ['tests', 'node_modules']
  })
  public ignoreOnCleanArray: string[]

  public static signature(): string {
    return 'test'
  }

  public static description(): string {
    return 'The description of test command.'
  }

  public async handle(): Promise<void> {
    console.log(this.requiredArg, this.notRequiredArg, this.option, this.notRequiredOption)
    console.log(this.any___VALLLUE, this.ignoreOnClean, this.ignoreOnCleanArray)
  }
}
