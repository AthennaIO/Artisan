/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Commander } from '#src/artisan/Commander'
import { Formatter } from '#src/helpers/Formatter'
import type { Argument, Option, OptionValues } from 'commander'

export class CommanderHandler {
  /**
   * Holds the commander error handler.
   */
  public static exceptionHandler: any

  /**
   * The commander instance.
   */
  public static commander = this.instantiate()

  /**
   * Get a new commander instance with default options.
   */
  public static instantiate() {
    return new Commander()
      .addHelpCommand('help [command]', 'Display help for [command]')
      .usage('[command] [arguments] [options]')
      .option(
        '--env <env>',
        'The environment the command should run under.',
        Env('APP_ENV') || Env('NODE_ENV')
      )
      .configureHelp({
        sortSubcommands: true,
        showGlobalOptions: true,
        formatHelp: (cmd, helper) =>
          Formatter.builder(cmd, helper)
            .setUsage()
            .setDescription()
            .setArguments()
            .setOptions()
            .setCommands()
            .setGlobalOptions()
            .getOutput()
      })
  }

  /**
   * Simple helper to reconstruct the commander instance.
   */
  public static reconstruct(): void {
    CommanderHandler.commander = this.instantiate()
  }

  /**
   * Parse the command called in the console and execute.
   */
  public static async parse(argv: string[]): Promise<Commander> {
    return CommanderHandler.commander.parseAsync(argv)
  }

  /**
   * Bind the exception handler if exists inside the action.
   */
  public static bindHandler(target: any): any {
    if (!CommanderHandler.exceptionHandler) {
      return (...args: any[]) => target.__exec.bind(target)(...args)
    }

    return (...args: any[]) =>
      target.__exec
        .bind(target)(...args)
        .catch(CommanderHandler.exceptionHandler)
  }

  /**
   * Set the CLI version. By default, the version set will be of the Athenna.
   */
  public static setVersion(version?: string): typeof CommanderHandler {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (CommanderHandler.commander._events['option:version']) {
      return this
    }

    if (version) {
      CommanderHandler.commander.version(
        version,
        '-v, --version',
        'Output the application version.'
      )

      return this
    }

    CommanderHandler.commander.version(
      'Athenna Framework v3.0.0',
      '-v, --version',
      'Output the framework version.'
    )

    return this
  }

  /**
   * Get the arguments of a command.
   */
  public static getCommandArgs(name: string): Argument[] {
    const commander: any = this.getCommand(name)

    return commander._args
  }

  /**
   * Get the options of a command.
   */
  public static getCommandOpts(name: string): Option[] {
    const commander: any = this.getCommand(name)

    return commander.options
  }

  /**
   * Get the option values of a command.
   */
  public static getCommandOptsValues(name: string): OptionValues {
    const commander = this.getCommand(name)

    return commander.optsWithGlobals()
  }

  /**
   * Get specific command my signature.
   */
  public static getCommand(signature: string): Commander {
    return CommanderHandler.getCommands().find(
      (command: any) => command._name === signature
    )
  }

  /**
   * Get all commands registered inside commander.
   */
  public static getCommands(): Commander[] {
    return CommanderHandler.commander.commands
  }

  /**
   * Verify if the actual commander instance has a command
   * with the given signature.
   */
  public static hasCommand(signature: string): boolean {
    return !!CommanderHandler.commander.commands.find(
      (command: any) => command._name === signature
    )
  }

  /**
   * Get commands with arguments and descriptions registered inside commander.
   */
  public static getCommandsInfo(alias?: string): Record<string, any> {
    const commands = {}

    CommanderHandler.getCommands().forEach((command: any) => {
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
