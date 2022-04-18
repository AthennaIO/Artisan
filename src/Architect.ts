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

import { Command } from 'commander'
import { Config } from '@athenna/config'
import { version } from '../package.json'
import { Controller } from './Commands/Make/Controller'

export class Architect {
  private readonly commander: Command

  public constructor() {
    this.commander = new Command()

    const appNameFiglet = figlet.textSync(Config.get('app.name'))
    const appNameFigletColorized = chalkRainbow(appNameFiglet)

    process.stdout.write(appNameFigletColorized + '\n')

    this.commander.version(`v${version}`, '-v, --version')

    this.registerDefaults()
  }

  /**
   * Get the commander instance of Architect.
   *
   * @return Promise<void>
   */
  getCommander(): Command {
    return this.commander
  }

  /**
   * Register the default Architect commands.
   *
   * @return {void}
   */
  registerDefaults(): void {
    new Controller().register()
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
