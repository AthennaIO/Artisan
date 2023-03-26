/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseCommand, Argument } from '#src'
import { Path, String } from '@athenna/common'
import { sep, resolve, isAbsolute } from 'node:path'

export class MakeCommandCommand extends BaseCommand {
  @Argument({
    description: 'The command name.',
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
      .path(this.getFilePath())
      .template('command')
      .setNameProperties(true)
      .make()

    this.logger.success(
      `Command ({yellow} "${file.name}") successfully created.`,
    )

    const signature = String.toCamelCase(file.name)
    const importPath = this.getImportPath(file.name)

    await this.rc.setTo('commands', signature, importPath).save()

    this.logger.success(
      `Athenna RC updated: ({dim,yellow} { commands += "${signature}": "${importPath}" })`,
    )
  }

  /**
   * Get the file path where it will be generated.
   */
  private getFilePath(): string {
    return this.getDestinationPath().concat(`${sep}${this.name}.${Path.ext()}`)
  }

  /**
   * Get the destination path for the file that will be generated.
   */
  private getDestinationPath(): string {
    let destination = Config.get(
      'rc.commands.make:command.destination',
      Path.console('Commands'),
    )

    if (!isAbsolute(destination)) {
      destination = resolve(Path.pwd(), destination)
    }

    return destination
  }

  /**
   * Get the import path that should be registered in RC file.
   */
  private getImportPath(fileName: string): string {
    const destination = this.getDestinationPath()

    return `${destination
      .replace(Path.pwd(), '')
      .replace(/\\/g, '/')
      .replace('/', '#')}/${fileName}`
  }
}
