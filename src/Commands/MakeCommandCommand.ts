/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path } from '@athenna/common'
import { Command, Argument } from '#src'

export class MakeCommandCommand extends Command {
  @Argument({
    description: 'The file name.',
  })
  public name: string

  public static signature(): string {
    return 'make:command'
  }

  public static description(): string {
    return 'Make a new command file.'
  }

  public async handle(): Promise<void> {
    this.logger.simple('({bold,green} [ MAKING COMMAND ])\n')

    const file = await this.generator
      .path(Path.console(`Commands/${this.name}.${Path.ext()}`))
      .template('artisan::command')
      .setNameProperties(true)
      .make()

    this.logger.success(
      `Command ({yellow} "${file.name}") successfully created.`,
    )
  }
}
