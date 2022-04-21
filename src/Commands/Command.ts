/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ora from 'ora'
import chalk from 'chalk'
import Table from 'cli-table'
import columnify from 'columnify'

import { Log } from '@athenna/logger'
import { Exec } from 'src/Utils/Exec'
import { Config } from '@athenna/config'
import { Command as Commander } from 'commander'
import { TableOptions } from 'src/Contracts/TableOptions'
import { NodeExecException } from 'src/Exceptions/NodeExecException'

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
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @return {void}
   */
  public addFlags(commander: Commander): Commander {
    return commander
  }

  /**
   * Execute the console command.
   *
   * @return {Promise<void>}
   */
  public abstract handle(...args: any[]): Promise<void>

  /**
   * Create a simple log with Chalk API.
   *
   * @return {void}
   */
  public simpleLog(message: string, ...chalkArgs: string[]): void {
    let colors = chalk

    chalkArgs.forEach(arg => (colors = colors[arg]))

    if (Config.get('logging.channels.console.driver') === 'null') {
      return
    }

    process.stdout.write('\n' + colors(message) + '\n')
  }

  /**
   * Create an info log in the console channel.
   *
   * @return {void}
   */
  public info(message: string, options?: any): void {
    Log.channel('console').info(message, options)
  }

  /**
   * Create a warn log in the console channel.
   *
   * @return {void}
   */
  public warn(message: string, options?: any): void {
    Log.channel('console').warn(message, options)
  }

  /**
   * Create an error log in the console channel.
   *
   * @return {void}
   */
  public error(message: string, options?: any): void {
    Log.channel('console').error(message, options)
  }

  /**
   * Create a debug log in the console channel.
   *
   * @return {void}
   */
  public debug(message: string, options?: any): void {
    Log.channel('console').debug(message, options)
  }

  /**
   * Create a success log in the console channel.
   *
   * @return {void}
   */
  public success(message: string, options?: any): void {
    Log.channel('console').success(message, options)
  }

  /**
   * Create a spinner using Ora API.
   *
   * @return {ora.Ora}
   */
  public createSpinner(options: string | ora.Options | undefined): ora.Ora {
    return ora(options)
  }

  /**
   * Log a table using cli-table API.
   *
   * @return {ora.Ora}
   */
  public logTable(tableOptions: Partial<TableOptions>, ...rows: any[]): void {
    const table = new Table(tableOptions)

    if (rows && rows.length) table.push(...rows)

    process.stdout.write(table.toString() + '\n')
  }

  /**
   * Log a table using cli-table API.
   *
   * @return {ora.Ora}
   */
  public columnify(
    data: Record<string, any> | any[],
    options: columnify.GlobalOptions,
  ): string {
    return columnify(data, options)
  }

  /**
   * Execute a command using the exec of child process.
   *
   * @param command
   * @param message
   * @protected
   */
  public async execCommand(command: string, message?: string) {
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
