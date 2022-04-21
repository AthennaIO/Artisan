/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import figlet from 'figlet'
import columnify from 'columnify'
import chalkRainbow from 'chalk-rainbow'

import { Path } from '@secjs/utils'
import { Config } from '@athenna/config'
import { version } from '../package.json'
import { Command } from 'src/Commands/Command'
import { Command as Commander } from 'commander'

export class Artisan {
  /**
   * Commander API instance.
   *
   * @private
   */
  private readonly commander: Commander

  /**
   * Creates a new instance of Artisan
   *
   * @return {Artisan}
   */
  public constructor() {
    this.commander = new Commander()
  }

  /**
   * Call any command from Artisan.
   *
   * @return Promise<void>
   */
  async call(command: string) {
    await this.commander.parseAsync([
      'node', // This will be ignored by commander
      'artisan', // This will be ignored by commander
      ...command.split(' '),
    ])
  }

  /**
   * List all commands with description.
   *
   * @param asColumn
   * @param alias
   */
  listCommands(asColumn: boolean, alias?: string): string
  listCommands(
    asColumn = false,
    alias?: string,
  ): Record<string, string> | string {
    const commands = {}

    this.commander.commands.forEach((command: any) => {
      if (alias && !command._name.startsWith(`${alias}:`)) {
        return
      }

      let name = command._name

      if (command.options.length) name = `${name} [options]`

      command._args.forEach(arg => {
        if (arg.required) {
          name = name.concat(` <${arg._name}>`)

          return
        }

        name = name.concat(` [${arg._name}]`)
      })

      commands[name] = command._description
    })

    if (asColumn) {
      return columnify(commands).replace('KEY', '').replace('VALUE', '')
    }

    return commands
  }

  /**
   * Set the version of the CLI.
   *
   * @return Promise<void>
   */
  setVersion(clientVersion?: any): void {
    if (clientVersion) {
      this.commander.version(`v${clientVersion}`, '-v, --version')

      return
    }

    this.commander.version(`v${version}`, '-v, --version')
  }

  /**
   * Get the commander instance of Artisan.
   *
   * @return Promise<void>
   */
  getCommander(): Commander {
    return this.commander
  }

  /**
   * Register the command inside commander instance.
   *
   * @return {void}
   */
  register(callback: (commander: Commander) => void): void {
    const commander = this.getCommander()

    callback(commander)
  }

  /**
   * Register the command inside commander instance.
   *
   * @return {void}
   */
  command(
    signature: string,
    handle: (this: Command, ...args: any[]) => void | Promise<void>,
  ): Commander {
    const commander = this.getCommander()

    /**
     * Create a fake class for the command to get
     * access to the helpers inside abstract class Command.
     */
    class FakeCmd extends Command {
      public signature = ''
      public description = ''

      public async handle(...args: any[]): Promise<void> {
        const fn = handle.bind(this)

        await fn(...args)
      }
    }

    const fakeCmd = new FakeCmd()

    return commander.command(signature).action(fakeCmd.handle.bind(fakeCmd))
  }

  /**
   * Parse the command called in console and execute.
   *
   * @return Promise<void>
   */
  async main(appName?: string): Promise<void> {
    /**
     * If argv is less or equal two, means that
     * the command that are being run is just
     * the CLI entrypoint. Example:
     *
     * - artisan
     * - node artisan
     *
     * In CLI entrypoint we are going to log the
     * chalkRainbow with his application name.
     */
    if (process.argv.length <= 2) {
      const appNameFiglet = figlet.textSync(appName || Config.get('app.name'))
      const appNameFigletColorized = chalkRainbow(appNameFiglet)

      process.stdout.write(appNameFigletColorized + '\n' + '\n')
    }

    Path.switchEnvVerify()

    this.setVersion(Config.get('app.version'))
    await this.commander.parseAsync(process.argv)

    Path.switchEnvVerify()
  }
}
