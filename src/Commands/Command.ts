/**
 * @athenna/architect
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Architect } from 'src/Facades/Architect'

export abstract class Command {
  /**
   * The name and signature of the console command.
   */
  protected abstract signature: string

  /**
   * The console command description.
   */
  protected abstract description: string

  /**
   * Execute the console command.
   *
   * @return {Promise<void>}
   */
  public abstract handle(...args: any[]): Promise<void>

  /**
   * Register the command inside commander instance.
   *
   * @return {void}
   */
  public register(): void {
    Architect.getCommander()
      .command(this.signature)
      .description(this.description)
      .action(this.handle.bind(this))

    this.setFlags()
  }

  /**
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @return {void}
   */
  protected setFlags(): void {
    Architect.getCommander().showHelpAfterError().createHelp()
  }
}
