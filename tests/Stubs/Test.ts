/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Command } from '#src/Artisan/Command'
import { Argument, Option } from '#src'

export class Test extends Command {
  @Argument()
  public requiredArg: string

  @Option({
    signature: '-o, --other',
    description: 'Option.',
  })
  public option: string

  @Option({
    signature: '-oo, --otherOption',
    default: 'notRequiredOption',
    description: 'Other option.',
  })
  public notRequiredOption: string

  @Argument({
    required: false,
    default: 'notRequiredArg',
    description: 'Not required arg.',
  })
  public notRequiredArg: string

  public static signature(): string {
    return 'test'
  }

  public static description(): string {
    return 'The description of test command.'
  }

  public async handle(): Promise<void> {
    console.log(this.requiredArg, this.notRequiredArg, this.option, this.notRequiredOption)
  }
}
