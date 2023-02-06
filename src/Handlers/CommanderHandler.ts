/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Command as Commander } from 'commander'

export class CommanderHandler {
  /**
   * Holds the commander error handler.
   */
  private static exceptionHandler: any

  /**
   * The commander instance.
   */
  private static commander = new Commander()

  /**
   * Get the commander instance.
   */
  public static getCommander(): Commander {
    return this.commander
  }

  /**
   * Parse the command called in the console and execute.
   */
  public static async parse(argv: string[]): Promise<Commander> {
    return this.commander.parseAsync(argv)
  }

  /**
   * Set the exception handler for commander action method.
   */
  public static setExceptionHandler(handler: any): void {
    this.exceptionHandler = handler
  }

  /**
   * Bind the exception handler if exists inside the action.
   */
  public static bindHandler(target: any): any {
    if (!this.exceptionHandler) {
      return target.exec.bind(target)
    }

    return (...args: any[]) =>
      target.exec
        .bind(target)(...args)
        .catch(this.exceptionHandler)
  }

  /**
   * Set the CLI version. By default the version
   * set will be of the Athenna.
   */
  public static setVersion(version?: string): typeof CommanderHandler {
    if (version) {
      this.commander.version(`v${version}`, '-v, --version')

      return this
    }

    this.commander.version('Athenna Framework 3.0.0', '-v, --version')

    return this
  }

  /**
   * Get all commands registered inside commander or by alias.
   */
  public static getCommands(alias?: string): Record<string, any> {
    const commands = {}

    this.commander.commands.forEach((command: any) => {
      if (alias && !command._name.startsWith(`${alias}:`)) {
        return
      }

      let name = command._name

      if (command.options.length) {
        name = `${name} [options]`
      }

      command._args.forEach(arg => {
        if (arg.required) {
          name = name.concat(` <${arg._name}>`)

          return
        }

        name = name.concat(` [${arg._name}]`)
      })

      commands[name] = command._description
    })

    return commands
  }
}
