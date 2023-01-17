/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ora from 'ora'
import Chalk from 'chalk'
import figlet from 'figlet'
import Table from 'cli-table'
import columnify from 'columnify'
import chalkRainbow from 'chalk-rainbow'

import { Exec } from '@athenna/common'
import { Config } from '@athenna/config'
import { Log, Logger } from '@athenna/logger'

import { Artisan } from '#src/index'
import { Template } from '#src/Facades/Template'
import { NotImplementedHandleException } from '#src/Exceptions/NotImplementedHandleException'
import { NotImplementedSignatureException } from '#src/Exceptions/NotImplementedSignatureException'

export class Command {
  /**
   * The command logger.
   *
   * @type {Logger}
   */
  #logger = Config.exists('logging.channels.console')
    ? Log.channel('console')
    : Logger.getVanillaLogger({ driver: 'console', formatter: 'cli' })

  /**
   * The name and signature of the console command.
   *
   * @return {string}
   */
  get signature() {
    throw new NotImplementedSignatureException(this.constructor.name)
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
   * @param {import('#src/index').Commander} commander
   * @return {import('#src/index').Commander}
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
  handle(...args) {
    throw new NotImplementedHandleException(this.constructor.name)
  }

  /**
   * Log a simple message in terminal without any formatter.
   *
   * @param message
   * @param {string[]} chalkArgs
   * @return {void}
   */
  log(message, ...chalkArgs) {
    if (Config.is('logging.channels.console.driver', 'null')) {
      return
    }

    let chalk = Chalk

    chalkArgs.forEach(arg => (chalk = chalk[arg]))

    process.stdout.write(chalk(message).concat('\n'))
  }

  /**
   * Create a trace log in the console channel.
   *
   * @param {string} message
   * @return {void}
   */
  trace(message) {
    this.#logger.trace(message)
  }

  /**
   * Create a debug log in the console channel.
   *
   * @param {string} message
   * @return {void}
   */
  debug(message) {
    this.#logger.debug(message)
  }

  /**
   * Create an info log in the console channel.
   *
   * @param {string} message
   * @return {void}
   */
  info(message) {
    this.#logger.info(message)
  }

  /**
   * Create a success log in the console channel.
   *
   * @param {string} message
   * @return {void}
   */
  success(message) {
    this.#logger.success(message)
  }

  /**
   * Create a warn log in the console channel.
   *
   * @param {string} message
   * @return {void}
   */
  warn(message) {
    this.#logger.warn(message)
  }

  /**
   * Create an error log in the console channel.
   *
   * @param {string} message
   * @return {void}
   */
  error(message) {
    this.#logger.error(message)
  }

  /**
   * Create a fatal log in the console channel.
   *
   * @param {string} message
   * @return {void}
   */
  fatal(message) {
    this.#logger.fatal(message)
  }

  /**
   * Make a new file using templates and lint.
   *
   * @param path {string}
   * @param templateName {string}
   * @param [lint] {boolean}
   * @return {Promise<File>}
   */
  async makeFile(path, templateName, lint) {
    const file = await Template.fabricate(templateName, path)

    if (lint) {
      await Artisan.call(`eslint:fix ${file.path} --quiet`)
    }

    return file
  }

  /**
   * This method is an alias for:
   *
   * @example
   *  this.log(this.createTitle(message), ...chalkArgs)
   * @param message {string}
   * @param [chalkArgs] {string[]}
   * @return {void}
   */
  title(message, ...chalkArgs) {
    let title = this.createTitle(message.replace(/\n/g, ''))

    if (message.startsWith('\n')) {
      title = '\n' + title
    }

    if (message.endsWith('\n')) {
      title = title + '\n'
    }

    return this.log(title, ...chalkArgs)
  }

  /**
   * Create a tittle for message.
   *
   * @param {string} message
   * @return {string}
   */
  createTitle(message) {
    return `[ ${message.toUpperCase()} ]`
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
   * Create a table using cli-table API.
   *
   * @param {any} tableOptions
   * @param {any[]} rows
   * @return {string}
   */
  createTable(tableOptions, ...rows) {
    const table = new Table(tableOptions)

    if (rows && rows.length) table.push(...rows)

    return table.toString()
  }

  /**
   * Create a column for an object or array.
   *
   * @param {Record<string, any> | any[]} data
   * @param {{ columns: string[] }} [options]
   * @return {string}
   */
  createColumn(data, options) {
    return columnify(data, options)
  }

  /**
   * Create a big rainbow string.
   *
   * @param message {string}
   * @return {string}
   */
  createRainbow(message) {
    return chalkRainbow(figlet.textSync(message))
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
      const result = await Exec.command(command)

      if (message) spinner.succeed(message)

      return result
    } catch (err) {
      if (message) spinner.fail(message)

      throw err
    }
  }
}
