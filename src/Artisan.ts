/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import figlet from 'figlet'
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
  async main(): Promise<void> {
    if (process.argv.length === 2) {
      const appNameFiglet = figlet.textSync(Config.get('app.name'))
      const appNameFigletColorized = chalkRainbow(appNameFiglet)

      process.stdout.write(appNameFigletColorized + '\n' + '\n')
    }

    Path.switchEnvVerify()

    this.setVersion(Config.get('app.version'))
    await this.commander.parseAsync(process.argv)

    Path.switchEnvVerify()
  }
}
