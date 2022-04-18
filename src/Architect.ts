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
import { Command as Commander } from 'commander'

export class Architect {
  private readonly commander: Commander

  public constructor() {
    this.commander = new Commander()

    const appNameFiglet = figlet.textSync(Config.get('app.name'))
    const appNameFigletColorized = chalkRainbow(appNameFiglet)

    process.stdout.write(appNameFigletColorized + '\n')

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
   * Parse the command called in console and execute.
   *
   * @return Promise<void>
   */
  async main(): Promise<void> {
    await this.commander.parseAsync(process.argv)
  }
}
