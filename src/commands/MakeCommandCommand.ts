/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path } from '@athenna/common'
import { BaseCommand, Argument } from '#src'

export class MakeCommandCommand extends BaseCommand {
  @Argument({
    description: 'The command name.'
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

    const destination = Config.get(
      'rc.commands.make:command.destination',
      Path.commands()
    )

    const file = await this.generator
      .fileName(this.name)
      .destination(destination)
      .template('command')
      .setNameProperties(true)
      .make()

    this.logger.success(
      `Command ({yellow} "${file.name}") successfully created.`
    )

    const signature = this.generator.getSignature()
    const importPath = this.generator.getImportPath()

    await this.rc.setTo('commands', signature, importPath).save()

    this.logger.success(
      `Athenna RC updated: ({dim,yellow} { commands += "${signature}": "${importPath}" })`
    )
  }
}
