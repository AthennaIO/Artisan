/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import figlet from 'figlet'
import chalkRainbow from 'chalk-rainbow'

import { Config } from '@athenna/config'
import { Commander } from '#src/artisan/Commander'
import { Annotation } from '#src/helpers/Annotation'
import { BaseCommand } from '#src/artisan/BaseCommand'
import { CommanderHandler } from '#src/handlers/CommanderHandler'
import type { CallInChildOptions } from '#src/types/CallInChildOptions'
import {
  Exec,
  Is,
  Macroable,
  Options,
  Path,
  type CommandOutput
} from '@athenna/common'

export class ArtisanImpl extends Macroable {
  /**
   * Register the command if it is not registered yet.
   */
  public register(Command: any): Commander {
    const command = new Command()

    /** Set the command signature and description. */
    const commander = CommanderHandler.commander
      .command(Command.signature())
      .description(Command.description())

    /** Define custom commander options if exists */
    Command.commander(commander)

    /** Set arguments */
    Annotation.getArguments(command).forEach(arg => {
      commander.argument(arg.signature, arg.description, arg.default)
    })

    /** Set options */
    Annotation.getOptions(command).forEach(option => {
      if (option.isFromGlobal) {
        return
      }

      commander.option(option.signature, option.description, option.default)
    })

    /** Set exception handler and handler */
    return commander
      .action(CommanderHandler.bindHandler(command))
      .showHelpAfterError()
  }

  /**
   * Create commands like a route.
   *
   * @example
   * ```ts
   * Artisan.route('hello', function (hello: string, options: any) {
   *   console.log(hello)
   *   console.log(options.hello)
   * })
   *  .argument('<hello>', 'Description for hello arg.')
   *  .option('--hello', 'Description for hello option.')
   * ```
   */
  public route(
    signature: string,
    handler: (this: BaseCommand, ...args: any[]) => Promise<void>
  ): Commander {
    class HandleCommand extends BaseCommand {
      public static signature() {
        return signature
      }

      public async handle() {}

      protected __exec(...args: any[]) {
        const fn = handler.bind(this)

        const commander = CommanderHandler.getCommand(signature)

        return fn(...[...args, commander.opts()])
      }
    }

    const commander = this.register(HandleCommand)

    commander.constructor.prototype.settings = function (settings: any) {
      Config.set(`rc.commands.${this.name()}`, settings)
    }

    return commander
  }

  /**
   * Call an Artisan command.
   *
   * @example
   * ```ts
   * // Call command ignoring settings, loadApp, stayAlive and environments.
   * Artisan.call('serve --watch')
   *
   * // Call command and handle settings.
   * Artisan.call('serve --watch', { withSettings: true })
   * ```
   */
  public async call(
    command: string,
    options: { withSettings?: boolean } = {}
  ): Promise<void> {
    options = Options.create(options, {
      withSettings: false
    })

    const argv = ['node', 'artisan', ...command.split(' ')]

    if (!options.withSettings) {
      await CommanderHandler.setVersion(Config.get('app.version')).parse(argv)

      return
    }

    await this.parseWithSettings(argv)
  }

  /**
   * Call an Artisan command inside a child process.
   * This method needs to execute a file to bootstrap
   * under the hood, by default the "Path.bin(`artisan.${Path.ext()}`)"
   * is used and the executor is "sh node".
   *
   * @example
   * ```ts
   * Artisan.callInChild('serve --watch')
   * // or
   * Artisan.callInChild('serve --watch', {
   *   path: Path.pwd('other-artisan.ts')
   * })
   * ```
   */
  public callInChild(
    command: string,
    options?: CallInChildOptions
  ): Promise<CommandOutput> {
    options = Options.create(options, {
      path: Config.get(
        'rc.artisan.child.path',
        Path.bin(`console.${Path.ext()}`)
      )
    })

    options.path = Path.parseExt(options.path)

    const parsedCommand = command === '' ? [] : command.split(' ')

    return Exec.node(options.path, parsedCommand, {
      reject: false,
      cwd: Path.pwd(),
      localDir: Path.pwd()
    })
  }

  /**
   * Search for the command settings, set the CLI version and parse the
   * "argv" to execute the command.
   */
  public async parse(argv: string[], appName?: string): Promise<void> {
    if (appName) {
      const appNameFiglet = figlet.textSync(appName)
      const appNameFigletColorized = chalkRainbow(appNameFiglet)

      CommanderHandler.commander.addHelpText('before', appNameFigletColorized)
    }

    await this.parseWithSettings(argv)
  }

  /**
   * Parse the command with the settings.
   */
  private async parseWithSettings(argv: string[]) {
    let command = Config.get(`rc.commands.${argv[2]}`)

    if (!command || Is.String(command)) {
      command = {}
    }

    const { env, loadApp, stayAlive, environments } = Options.create(command, {
      env: undefined,
      loadApp: false,
      stayAlive: false,
      environments: ['console']
    })

    const hasEnvSet =
      Env('APP_ENV') || Env('NODE_ENV') || process.argv.includes('--env')

    if (env && !hasEnvSet) {
      process.env.APP_ENV = env
      process.env.NODE_ENV = env
    }

    if (loadApp) {
      const ignite = ioc.safeUse('Athenna/Core/Ignite')

      await ignite.fire(environments)
    }

    await CommanderHandler.setVersion(Config.get('app.version')).parse(argv)

    if (!stayAlive) {
      process.exit(0)
    }
  }
}
