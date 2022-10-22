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

import { Log } from '@athenna/logger'
import { Config } from '@athenna/config'
import { Exec, Path } from '@athenna/common'
import { Command as Commander } from 'commander'

import { Command } from '#src/Commands/Command'

export * from './Facades/Artisan.js'
export * from './Facades/Template.js'
export * from './Commands/Command.js'
export * from './Kernels/ConsoleKernel.js'
export * from './Helpers/ArtisanLoader.js'
export * from './Helpers/TemplateHelper.js'
export * from './Helpers/FilePropertiesHelper.js'
export * from './Handlers/ConsoleExceptionHandler.js'

export class ArtisanImpl {
  /**
   * Commander API instance.
   *
   * @type {import('commander').Command}
   */
  #commander

  /**
   * Artisan error handler.
   *
   * @type {(...args: any[]) => any | Promise<any>}
   */
  #errorHandler

  /**
   * Creates a new instance of Artisan.
   */
  constructor() {
    this.#commander = new Commander()
    this.setErrorHandler(error =>
      Log.channel('console').error(JSON.stringify(error, null, 2)),
    )
  }

  /**
   * Set Artisan error handler.
   *
   * @param {(...args: any[]) => any | Promise<any>} handler
   * @return {void}
   */
  setErrorHandler(handler) {
    this.#errorHandler = handler
  }

  /**
   * Get Artisan error handler.
   *
   * @return {(...args: any[]) => any | Promise<any>}
   */
  getErrorHandler() {
    return this.#errorHandler
  }

  /**
   * Call any command from Artisan and return as child process.
   *
   * @param {string} command
   * @param {string} [artisanPath]
   * @return {Promise<{ stdout: string, stderr: string }>}
   */
  async callInChild(command, artisanPath = Path.pwd('artisan.js')) {
    if (process.env.NODE_ENV) {
      command = `NODE_ENV=${process.env.NODE_ENV} node ${artisanPath} ${command}`
    } else {
      command = `node ${artisanPath} ${command}`
    }

    return Exec.command(command)
  }

  /**
   * Call any command from Artisan.
   *
   * @param {string} command
   * @return Promise<Command>
   */
  async call(command) {
    return this.#commander.parseAsync([
      'node', // This will be ignored by commander
      'artisan', // This will be ignored by commander
      ...command.split(' '),
    ])
  }

  /**
   * List all commands with description.
   *
   * @param {boolean} [asColumn]
   * @param {string} [alias]
   * @return {Record<string, string> | string}
   */
  listCommands(asColumn = false, alias) {
    const commands = {}

    this.#commander.commands.forEach(command => {
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
   * @param {any} [clientVersion]
   * @return {void}
   */
  setVersion(clientVersion) {
    if (clientVersion) {
      this.#commander.version(`v${clientVersion}`, '-v, --version')

      return
    }

    this.#commander.version(`v1.0.0`, '-v, --version')
  }

  /**
   * Get the commander instance of Artisan.
   *
   * @return {import('commander').Command}
   */
  getCommander() {
    return this.#commander
  }

  /**
   * Set the commander instance of Artisan.
   *
   * @param {import('commander').Command} commander
   * @return {void}
   */
  setCommander(commander) {
    this.#commander = commander
  }

  /**
   * Register the command inside commander instance.
   *
   * @param {(commander: Commander) => void} callback
   * @return {void}
   */
  register(callback) {
    const commander = this.getCommander()

    callback(commander)
  }

  /**
   * Register the command inside commander instance.
   *
   * @param {string} signature
   * @param {(this: Command, ...args: any[]) => void | Promise<void>} handle
   * @return {import('commander').Command}
   */
  command(signature, handle) {
    const commander = this.getCommander()

    /**
     * Create a fake class for the command to get
     * access to the helpers inside abstract class Command.
     */
    class FakeCmd extends Command {
      signature = ''
      description = ''

      async handle(...args) {
        const fn = handle.bind(this)

        await fn(...args)
      }
    }

    /**
     * Action runner catches all exceptions thrown by commands
     * exceptions and sends to the Artisan exception handler.
     *
     * @param {any} fn
     */
    const actionRunner = fn => {
      return (...args) => fn(...args).catch(this.getErrorHandler())
    }

    const fakeCmd = new FakeCmd()

    return commander
      .command(signature)
      .action(actionRunner(fakeCmd.handle.bind(fakeCmd)))
      .showHelpAfterError()
  }

  /**
   * Parse the command called in console and execute.
   *
   * @param {string} [appName]
   * @return {Promise<void>}
   */
  async main(appName) {
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

    this.setVersion(Config.get('app.version'))

    await this.#commander.parseAsync(process.argv)
  }
}
