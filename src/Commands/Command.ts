/**
 * @athenna/architect
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ora from 'ora'
import chalk from 'chalk'

import { Log } from '@athenna/logger'
import { Exec } from 'src/Utils/Exec'
import { Command as Commander } from 'commander'
import { NodeExecException } from '../Exceptions/NodeExecException'

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
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @return {void}
   */
  protected setFlags(commander: Commander): Commander {
    return commander
  }

  /**
   * Create a simple log with Chalk API.
   *
   * @return {void}
   */
  protected simpleLog(message: string, ...chalkArgs: string[]): void {
    let colors = chalk

    chalkArgs.forEach(arg => (colors = colors[arg]))

    process.stdout.write('\n' + colors(message) + '\n')
  }

  /**
   * Create an info log in the console channel.
   *
   * @return {void}
   */
  protected info(message: string, options?: any): void {
    Log.channel('console').info(message, options)
  }

  /**
   * Create a warn log in the console channel.
   *
   * @return {void}
   */
  protected warn(message: string, options?: any): void {
    Log.channel('console').warn(message, options)
  }

  /**
   * Create an error log in the console channel.
   *
   * @return {void}
   */
  protected error(message: string, options?: any): void {
    Log.channel('console').error(message, options)
  }

  /**
   * Create a debug log in the console channel.
   *
   * @return {void}
   */
  protected debug(message: string, options?: any): void {
    Log.channel('console').debug(message, options)
  }

  /**
   * Create a success log in the console channel.
   *
   * @return {void}
   */
  protected success(message: string, options?: any): void {
    Log.channel('console').success(message, options)
  }

  /**
   * Create a spinner using Ora API.
   *
   * @return {ora.Ora}
   */
  protected createSpinner(options: string | ora.Options | undefined): ora.Ora {
    return ora(options)
  }

  /**
   * Execute a command using the exec of child process.
   *
   * @param command
   * @param message
   * @protected
   */
  protected async execCommand(command: string, message?: string) {
    const spinner = this.createSpinner(message)

    if (message) {
      spinner.color = 'yellow'

      spinner.start()
    }

    try {
      await Exec.command(command)

      if (message) spinner.succeed(message)
    } catch (err) {
      const stdout = err.stdout
      const stderr = err.stderr

      if (message) spinner.fail(message)

      throw new NodeExecException(command, stdout, stderr)
    }
  }
}
