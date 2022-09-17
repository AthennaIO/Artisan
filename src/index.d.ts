import * as ora from 'ora'
import { Command as Commander } from 'commander'

import { Facade } from '@athenna/ioc'
import { File } from '@secjs/utils'

export const Artisan: Facade & ArtisanImpl

export class Command {
  /**
   * The name and signature of the console command.
   *
   * @type {string}
   */
  get signature(): string
  /**
   * The console command description.
   *
   * @type {string}
   */
  get description(): string

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
   * @return {Promise<void>}
   */
  handle(): Promise<void>

  /**
   * Execute the console command.
   *
   * @param {any[]} args
   * @return {Promise<void>}
   */
  handle(...args: any[]): Promise<void>

  /**
   * Execute the console command.
   *
   * @param {string} argument
   * @return {Promise<void>}
   */
  handle(argument: string): Promise<void>

  /**
   * Execute the console command.
   *
   * @param {string} argument
   * @param {any} options
   * @return {Promise<void>}
   */
  handle(argument: string, options?: any): Promise<void>

  /**
   * Create a simple log with Chalk API.
   *
   * @param {string} message
   * @param {string[]} chalkArgs
   * @return {void}
   */
  log(message: string, ...chalkArgs: string[]): void

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
   * Make a new file using templates and lint.
   *
   * @param path {string}
   * @param templateName {string}
   * @param [lint] {boolean}
   * @return {Promise<File>}
   */
  makeFile(path: string, templateName: string, lint?: boolean): Promise<File>

  /**
   * This method is an alias for:
   *
   * @example
   *  this.log(this.createTitle(message), ...chalkArgs)
   * @param message {string}
   * @param [chalkArgs] {string[]}
   * @return {void}
   */
  title(message, ...chalkArgs): void

  /**
   * Create a tittle for message.
   *
   * @param {string} message
   * @return {string}
   */
  createTitle(message: string): string

  /**
   * Create a spinner using Ora API.
   *
   * @param {string|ora.Options} [options]
   * @return {ora.Ora}
   */
  createSpinner(options?: string | ora.Options): ora.Ora

  /**
   * Create a table using cli-table API.
   *
   * @param {any} tableOptions
   * @param {any[]} rows
   * @return {string}
   */
  createTable(tableOptions: any, ...rows: any[]): string

  /**
   * Create a column for an object or array.
   *
   * @param {Record<string, any> | any[]} data
   * @param {{ columns: string[] }} [options]
   * @return {string}
   */
  createColumn(data: Record<string, any> | any[], options?: { columns: string[] }): string

  /**
   * Create a big rainbow string.
   *
   * @param message {string}
   * @return {string}
   */
  createRainbow(message: string): string

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
  get commands(): any[] | Promise<any[]>

  /**
   * Register custom templates files.
   *
   * @return {import('@secjs/utils').File[] | Promise<any[]>}
   */
  get templates(): any[] | Promise<any[]>

  /**
   * Register all the commands to the artisan.
   *
   * @return {Promise<void>}
   */
  registerCommands(): Promise<void>

  /**
   * Register the default error handler.
   *
   * @return {Promise<void>}
   */
  registerErrorHandler(): Promise<void>

  /**
   * Register all the templates to the artisan.
   *
   * @return {Promise<void>}
   */
  registerTemplates(): Promise<void>
}

export class ArtisanLoader {
  /**
   * Return all commands from artisan console application.
   *
   * @return {any[]}
   */
  static loadCommands(): any[]

  /**
   * Return all templates from artisan console application.
   *
   * @return {any[]}
   */
  static loadTemplates(): any[]
}

export class TemplateHelper {
  /**
   * All templates set to Artisan work with.
   *
   * @type {File[]}
   */
  static templates: File[]

  /**
   * Custom properties to set when fabricating templates.
   *
   * @type {any}
   */
  static customProperties: any

  /**
   * Verify if template exists by name.
   *
   * @param name {string}
   * @return {boolean}
   */
  static hasTemplate(name: string): boolean

  /**
   * Add new template or subscribe an existent one.
   *
   * @param path {string}
   * @return {void}
   */
  static addTemplate(path: string): void

  /**
   * Add templates in folder or subscribe the existent.
   *
   * @param path {string}
   * @return {void}
   */
  static addTemplates(path: string): void

  /**
   * Add template file or subscribe the existent.
   *
   * @param file {File}
   * @return {void}
   */
  static addTemplateFile(file: File): void

  /**
   * Add templates in folder or subscribe the existent.
   *
   * @param files {File[]}
   * @return {void}
   */
  static addTemplatesFiles(files: File[]): void

  /**
   * Get the template file by name.
   *
   * @param {string} name
   * @return {File}
   */
  static getTemplate(name: string): File

  /**
   * Remove the template by name.
   *
   * @param name {string}
   * @return {void}
   */
  static removeTemplate(name: string): void

  /**
   * Remove the templates by names.
   *
   * @param names {string}
   * @return {void}
   */
  static removeTemplates(...names: string[]): void

  /**
   * Set custom template properties.
   *
   * @param key {string}
   * @param value {any}
   * @return {void}
   */
  static addProperty(key: string, value: any): void

  /**
   * Remove the custom template property.
   *
   * @param key {string}
   * @return {void}
   */
  static removeProperty(key: string): void

  /**
   * Get template params to render in templates.
   *
   * @param name {string}
   * @return {any}
   */
  static getTemplateParams(name: string): any

  /**
   * Fabricate the file by templateName.
   *
   * @param templateName {string}
   * @param filePath {string}
   * @return {Promise<File>}
   */
  static fabricate(templateName, filePath): Promise<File>
}

export class FilePropertiesHelper {
  /**
   * Add content to array property in file.
   *
   * @param {string} path
   * @param {string} matcher
   * @param {string} content
   * @return {Promise<File>}
   */
  static addContentToArrayProperty(path: string, matcher: string, content: string): Promise<File>

  /**
   * Add content to object property in file.
   *
   * @param {string} path
   * @param {string} matcher
   * @param {string} content
   * @return {Promise<File>}
   */
  static addContentToObjectProperty(path: string, matcher: string, content: string): Promise<File>

  /**
   * Add content to function property in file.
   *
   * @param {string} path
   * @param {string} matcher
   * @param {string} content
   * @return {Promise<File>}
   */
  static addContentToFunctionProperty(path: string, matcher: string, content: string): Promise<File>

  /**
   * Replace the content of the array getter inside a file.
   *
   * @param {string} path
   * @param {string} getter
   * @param {string} content
   * @return {Promise<File>}
   */
  static addContentToArrayGetter(path: string, getter: string, content: string): Promise<File>

  /**
   * Replace the content of the object getter inside a file.
   *
   * @param {string} path
   * @param {string} getter
   * @param {string} content
   * @return {Promise<File>}
   */
  static addContentToObjectGetter(path: string, getter: string, content: string): Promise<File>
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
   * Call any command from Artisan and return as child process.
   *
   * @param {string} command
   * @param {string} [artisanPath]
   * @return {Promise<{ stdout: string, stderr: string }>}
   */
  callInChild(command: string, artisanPath?: string): Promise<{ stdout: string, stderr: string }>

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
