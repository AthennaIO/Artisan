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

import { Exec } from '@athenna/common'
import { Config } from '@athenna/config'
import { Commander } from '#src/Artisan/Commander'
import { BaseCommand } from '#src/Artisan/BaseCommand'
import { CommandSettings } from '#src/Types/CommandSettings'
import { CommanderHandler } from '#src/Handlers/CommanderHandler'
import { COMMANDS_SETTINGS } from '#src/Constants/CommandsSettings'

export class ArtisanImpl {
  /**
   * Register the command if it is not registered yet.
   */
  public register(command: any): Commander {
    const key = 'artisan::commander'
    const Command = command.constructor

    COMMANDS_SETTINGS.set(Command.signature(), Command.settings())

    if (Reflect.hasMetadata(key, command)) {
      return
    }

    const commander = CommanderHandler.getCommander()
      .command(Command.signature())
      .description(Command.description())
      .action(CommanderHandler.bindHandler(command))
      .showHelpAfterError()

    Reflect.defineMetadata(key, commander, command)

    return commander
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
    handler: (this: BaseCommand, ...args: any[]) => Promise<void>,
  ): Commander {
    class HandleCommand extends BaseCommand {
      public static signature() {
        return signature
      }

      public async handle() {}

      protected __exec(...args: any[]) {
        const fn = handler.bind(this)

        const commander: Commander = Reflect.getMetadata(
          'artisan::commander',
          this,
        )

        return fn(...[...args, commander.opts()])
      }
    }

    const commander = this.register(new HandleCommand())

    commander.constructor.prototype.settings = function (
      settings: CommandSettings,
    ) {
      COMMANDS_SETTINGS.set(this.name(), settings)
    }

    return commander
  }

  /**
   * Call an Artisan command.
   *
   * @example
   * ```ts
   * Artisan.call('serve --watch')
   * ```
   */
  public async call(command: string): Promise<void> {
    return this.parse(['node', 'artisan', ...command.split(' ')])
  }

  /**
   * Call an Artisan command inside a child process.
   * This method needs to execute a file to bootstrap
   * under the hood, by default the "Path.pwd(`artisan.${Path.ext()}`)"
   * is used.
   *
   * @example
   * ```ts
   * Artisan.callInChild('serve --watch')
   * // or
   * Artisan.callInChild('serve --watch', Path.pwd('other-artisan.ts'))
   * ```
   */
  public async callInChild(
    command: string,
    path = Path.pwd(`artisan.${Path.ext()}`),
  ): Promise<{ stdout: string; stderr: string }> {
    let executor = 'node'

    if (Env('IS_TS', false)) {
      executor = 'ts-node'
    }

    if (Env('NODE_ENV')) {
      command = `cross-env NODE_ENV=${process.env.NODE_ENV} ${executor} ${path} ${command}`
    } else {
      command = `${executor} ${path} ${command}`
    }

    return Exec.command(command, { ignoreErrors: true })
  }

  /**
   * Search for the command settings, set the CLI version and parse the
   * "argv" to execute the command.
   */
  public async parse(argv: string[], appName?: string): Promise<void> {
    const { loadApp, stayAlive, environments } = COMMANDS_SETTINGS.get(
      argv[2],
    ) || {
      loadApp: false,
      stayAlive: false,
      environments: ['console'],
    }

    if (appName) {
      /**
       * If argv is less or equal two, means that
       * the command that are being run is just
       * the CLI entrypoint. Example:
       *
       * - ts-node artisan
       *
       * In CLI entrypoint we are going to log the
       * chalkRainbow with his application name.
       */
      if (process.argv.length <= 2) {
        const appNameFiglet = figlet.textSync(appName)
        const appNameFigletColorized = chalkRainbow(appNameFiglet)

        process.stdout.write(appNameFigletColorized + '\n' + '\n')
      }
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
