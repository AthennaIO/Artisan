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
import { Config, Exec } from '@secjs/utils'

export class Command {
  /**
   * The name and signature of the console command.
   *
   * @return {string}
   */
  get signature() {
    throw new Error('Signature getter not implemented.')
  }

  /**
   * The console command description.
   *
   * @return {string}
   */
  get description() {
    return ''
  }

  /**
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @param {import('commander').Command} commander
   * @return {import('commander').Command}
   */
  addFlags(commander) {
    return commander
  }

  /**
   * Execute the console command.
   *
   * @param {any[]} args
   * @return {Promise<void>}
   */
  handle(...args) {}

  /**
   * Create a simple log with Chalk API.
   *
   * @param {string} message
   * @param {string[]} chalkArgs
   * @return {void}
   */
  simpleLog(message, ...chalkArgs) {
    let colors = chalk

    const rmNewLineStart = chalkArgs[0] === 'rmNewLineStart'

    if (rmNewLineStart) chalkArgs.shift()

    chalkArgs.forEach(arg => (colors = colors[arg]))

    if (Config.get('logging.channels.console.driver') === 'null') {
      return
    }

    const log = colors(message).concat('\n')

    if (rmNewLineStart) {
      process.stdout.write(log)

      return
    }

    process.stdout.write('\n'.concat(log))
  }

  /**
   * Create an info log in the console channel.
   *
   * @param {string} message
   * @param {any} [options]
   * @return {void}
   */
  info(message, options) {
    Log.channel('console').info(message, options)
  }

  /**
   * Create a warn log in the console channel.
   *
   * @param {string} message
   * @param {any} [options]
   * @return {void}
   */
  warn(message, options) {
    Log.channel('console').warn(message, options)
  }

  /**
   * Create an error log in the console channel.
   *
   * @param {string} message
   * @param {any} [options]
   * @return {void}
   */
  error(message, options) {
    Log.channel('console').error(message, options)
  }

  /**
   * Create a debug log in the console channel.
   *
   * @param {string} message
   * @param {any} [options]
   * @return {void}
   */
  debug(message, options) {
    Log.channel('console').debug(message, options)
  }

  /**
   * Create a success log in the console channel.
   *
   * @param {string} message
   * @param {any} [options]
   * @return {void}
   */
  success(message, options) {
    Log.channel('console').success(message, options)
  }

  /**
   * Create a spinner using Ora API.
   *
   * @param {string|ora.Options} [options]
   * @return {ora.Ora}
   */
  createSpinner(options) {
    return ora(options)
  }

  /**
   * Log a table using cli-table API.
   *
   * @param {any} tableOptions
   * @param {any[]} rows
   * @return {void}
   */
  logTable(tableOptions, ...rows) {
    const table = new Table(tableOptions)

    if (rows && rows.length) table.push(...rows)

    process.stdout.write(table.toString() + '\n')
  }

  /**
   * Columnify an object or array.
   *
   * @param {Record<string, any> | any[]} data
   * @param {any} [options]
   * @return {string}
   */
  columnify(data, options) {
    return columnify(data, options)
  }

  /**
   * Execute a command using the exec of child process.
   *
   * @param {string} command
   * @param {string} [message]
   */
  async execCommand(command, message) {
    const spinner = this.createSpinner(message)

    if (message) {
      spinner.color = 'yellow'

      spinner.start()
    }

    try {
      await Exec.command(command)

      if (message) spinner.succeed(message)
    } catch (err) {
      if (message) spinner.fail(message)

      throw err
    }
  }
}
