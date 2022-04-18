/**
 * @athenna/architect
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import figlet from 'figlet'
import chalkRainbow from 'chalk-rainbow'

import { Config } from '@athenna/config'
import { version } from '../package.json'
import { Command } from 'src/Commands/Command'
import { Command as Commander } from 'commander'

export class Architect {
  private readonly commander: Commander

  /**
   * Creates a new instance of Architect
   *
   * @return {Architect}
   */
  public constructor() {
    this.commander = new Commander()

    /**
     * Verify if console channel is using null driver
     */
    if (Config.get('logging.channels.console.driver') !== 'null') {
      const appNameFiglet = figlet.textSync(Config.get('app.name'))
      const appNameFigletColorized = chalkRainbow(appNameFiglet)

      process.stdout.write(appNameFigletColorized + '\n')
    }

    this.commander.version(`v${version}`, '-v, --version')
  }

  /**
   * Call any command from Architect.
   *
   * @return Promise<void>
   */
  async call(command: string) {
    await this.commander.parseAsync([
      'node', // This will be ignored by commander
      'architect', // This will be ignored by commander
      ...command.split(' '),
    ])
  }

  /**
   * Get the commander instance of Architect.
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
    await this.commander.parseAsync(process.argv)
  }
}
