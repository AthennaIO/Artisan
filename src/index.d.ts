import { File } from '@secjs/utils'
import { Facade } from '@athenna/ioc'

import { Command as Commander } from 'commander'
import * as ora from 'ora'

export const Artisan: Facade & ArtisanImpl

export class Command {
  /**
   * The name and signature of the console command.
   *
   * @type {string}
   */
  signature: string
  /**
   * The console command description.
   *
   * @type {string}
   */
  description: string

  /**
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @param {import('commander').Command} commander
   * @return {import('commander').Command}
   */
  addFlags(commander: Commander): Commander

  /**
   * Execute the console command.
   *
   * @param {any[]} args
   * @return {Promise<void>}
   */
  handle(...args: any[]): Promise<void>

  /**
   * Create a simple log with Chalk API.
   *
   * @param {string} message
   * @param {string[]} chalkArgs
   * @return {void}
   */
  simpleLog(message: string, ...chalkArgs: string[]): void

  /**
   * Create an info log in the console channel.
   *
   * @param {string} message
   * @param {any} [options]
   * @return {void}
   */
  info(message: string, options?: any): void

  /**
   * Create a warn log in the console channel.
   *
   * @param {string} message
   * @param {any} [options]
   * @return {void}
   */
  warn(message: string, options?: any): void

  /**
   * Create an error log in the console channel.
   *
   * @param {string} message
   * @param {any} [options]
   * @return {void}
   */
  error(message: string, options?: any): void

  /**
   * Create a debug log in the console channel.
   *
   * @param {string} message
   * @param {any} [options]
   * @return {void}
   */
  debug(message: string, options?: any): void

  /**
   * Create a success log in the console channel.
   *
   * @param {string} message
   * @param {any} [options]
   * @return {void}
   */
  success(message: string, options?: any): void

  /**
   * Create a spinner using Ora API.
   *
   * @param {string|ora.Options} [options]
   * @return {ora.Ora}
   */
  createSpinner(options?: string | ora.Options): ora.Ora

  /**
   * Log a table using cli-table API.
   *
   * @param {any} tableOptions
   * @param {any[]} rows
   * @return {void}
   */
  logTable(tableOptions: any, ...rows: any[]): void

  /**
   * Columnify an object or array.
   *
   * @param {Record<string, any> | any[]} data
   * @param {any} [options]
   * @return {string}
   */
  columnify(data: Record<string, any> | any[], options?: any): string

  /**
   * Execute a command using the exec of child process.
   *
   * @param {string} command
   * @param {string} [message]
   */
  execCommand(command: string, message?: string): Promise<void>
}

export class ConsoleKernel {
  /**
   * Register the commands for the application.
   *
   * @type {import('#src/index').Command[] | Promise<any>}
   */
  commands: any[] | Promise<any>

  /**
   * Register all the commands to the artisan.
   *
   * @return {Promise<void>}
   */
  registerCommands(): Promise<void>

  /**
   * Register the default error handler
   *
   * @return {Promise<void>}
   */
  registerErrorHandler(): Promise<void>
}

export class ArtisanLoader {
  /**
   * Return all commands from artisan http application.
   *
   * @return {any[]}
   */
  static loadHttp(): any[]

  /**
   * Return all commands from artisan console application.
   *
   * @return {any[]}
   */
  static loadConsole(): any[]
}

export class TemplateHelper {
  /**
   * Normalize the resource name removing duplicated.
   *
   * @param {string} name
   * @param {string} resource
   * @return {string}
   */
  static normalizeName(name: string, resource: string): string

  /**
   * Get the template file by name or undefined.
   *
   * @param {string} templateName
   * @return {File}
   */
  static getTemplate(templateName: string): File

  /**
   * Replace the name of the template file with values.
   *
   * @param {string} name
   * @param {string} baseTemplateName
   * @return {string}
   */
  static replaceTemplateName(name: string, baseTemplateName: string): string

  /**
   * Replace the values inside the template file using ejs.
   *
   * @param {string} name
   * @param {Buffer} templateContent
   * @return {Buffer}
   */
  static replaceTemplateValues(name: string, templateContent: Buffer): Buffer

  /**
   * Replace the content of the array property inside a file.
   *
   * @param {string} path
   * @param {string} matcher
   * @param {string} importAlias
   */
  static replaceArrayProperty(
    path: string,
    matcher: string,
    importAlias: string,
  ): Promise<void>

  /**
   * Replace the content of the object property inside a file.
   *
   * @param {string} path
   * @param {string} matcher
   * @param {string} resource
   * @param {string} importAlias
   */
  static replaceObjectProperty(
    path: string,
    matcher: string,
    resource: string,
    importAlias: string,
  ): Promise<void>

  /**
   * Create a new file from resource.
   *
   * @param {string} name
   * @param {string} resource
   * @param {string} subPath
   * @return {Promise<File>}
   */
  static getResourceFile(
    name: string,
    resource: string,
    subPath: string,
  ): Promise<File>
}

export class ConsoleExceptionHandler {
  /**
   * The global exception handler of all Artisan commands.
   *
   * @param {any} error
   * @return {Promise<void>}
   */
  handle(error: any): Promise<void>
}

export class ArtisanImpl {
  /**
   * Set Artisan error handler.
   *
   * @param {(...args: any[]) => any | Promise<any>} handler
   * @return {void}
   */
  setErrorHandler(handler: (...args: any[]) => any | Promise<any>): void

  /**
   * Get Artisan error handler.
   *
   * @return {(...args: any[]) => any | Promise<any>}
   */
  getErrorHandler(): (...args: any[]) => any | Promise<any>

  /**
   * Call any command from Artisan.
   *
   * @param {string} command
   * @return Promise<Commander>
   */
  call(command: string): Promise<Commander>

  /**
   * List all commands with description.
   *
   * @param {boolean} [asColumn]
   * @param {string} [alias]
   * @return {Record<string, string> | string}
   */
  listCommands(
    asColumn?: boolean,
    alias?: string,
  ): Record<string, string> | string

  /**
   * Set the version of the CLI.
   *
   * @param {any} [clientVersion]
   * @return {void}
   */
  setVersion(clientVersion?: any): void

  /**
   * Get the commander instance of Artisan.
   *
   * @return {import('commander').Command}
   */
  getCommander(): Commander

  /**
   * Set the commander instance of Artisan.
   *
   * @return {import('commander').Command}
   */
  setCommander(commander: Commander): void

  /**
   * Register the command inside commander instance.
   *
   * @param {(commander: Commander) => void} callback
   * @return {void}
   */
  register(callback: (commander: Commander) => void): void

  /**
   * Register the command inside commander instance.
   *
   * @param {string} signature
   * @param {(this: Command, ...args: any[]) => void | Promise<void>} handle
   * @return {import('commander').Command}
   */
  command(
    signature: string,
    handle: (this: Command, ...args: any[]) => void | Promise<void>,
  ): Commander

  /**
   * Parse the command called in console and execute.
   *
   * @param {string} [appName]
   * @return {Promise<void>}
   */
  main(appName?: string): Promise<void>
}
