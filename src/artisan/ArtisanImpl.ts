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

import { platform } from 'node:os'
import { Config } from '@athenna/config'
import { Decorator } from '#src/helpers/Decorator'
import { Commander } from '#src/artisan/Commander'
import { BaseCommand } from '#src/artisan/BaseCommand'
import { CommanderHandler } from '#src/handlers/CommanderHandler'
import { Exec, Is, Options, Path, type CommandOutput } from '@athenna/common'

export class ArtisanImpl {
  /**
   * Register the command if it is not registered yet.
   */
  public register(command: any): Commander {
    const commander = Decorator.getCommander(command)

    /**
     * We are not going to register the command in the Decorator
     * helper because "Option" and "Argument" decorators will
     * register the command without instantiating the class correctly.
     */
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

        const commander: Commander = Reflect.getMetadata(
          'artisan:commander',
          this
        )

        return fn(...[...args, commander.opts()])
      }
    }

    const commander = this.register(new HandleCommand())

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
   * Artisan.call('serve --watch', false)
   * ```
   */
  public async call(command: string, ignoreSettings = true): Promise<void> {
    const argv = ['./node', 'artisan', ...command.split(' ')]

    if (ignoreSettings) {
      await CommanderHandler.setVersion(Config.get('app.version')).parse(argv)

      return
    }

    await this.parseWithSettings(argv)
  }

  /**
   * Call an Artisan command inside a child process.
   * This method needs to execute a file to bootstrap
   * under the hood, by default the "Path.bootstrap(`artisan.${Path.ext()}`)"
   * is used and the executor is "sh node".
   *
   * @example
   * ```ts
   * Artisan.callInChild('serve --watch')
   * // or
   * Artisan.callInChild('serve --watch', {
   *   executor: 'node --inspect',
   *   path: Path.pwd('other-artisan.ts')
   * })
   * ```
   */
  public async callInChild(
    command: string,
    options?: { path?: string; executor?: string }
  ): Promise<CommandOutput> {
    options = Options.create(options, {
      executor: Config.get('rc.artisan.child.executor', 'sh node'),
      path: Config.get(
        'rc.artisan.child.path',
        Path.bootstrap(`artisan.${Path.ext()}`)
      )
    })

    options.path = Path.parseExt(options.path)

    const separator = platform() === 'win32' ? '&' : '&&'
    const executor = `cd ${Path.pwd()} ${separator} ${options.executor}`

    if (Env('NODE_ENV')) {
      command = `cross-env NODE_ENV=${process.env.NODE_ENV} ${separator} ${executor} ${options.path} ${command}`
    } else {
      command = `${executor} ${options.path} ${command}`
    }

    return Exec.command(command, { ignoreErrors: true })
  }

  /**
   * Search for the command settings, set the CLI version and parse the
   * "argv" to execute the command.
   */
  public async parse(argv: string[], appName?: string): Promise<void> {
    if (appName) {
      /**
       * If argv is less or equal two, means that
       * the command that are being run is just
       * the CLI entrypoint. Example:
       *
       * - node artisan
       *
       * In CLI entrypoint we are going to log the
       * chalkRainbow with his application name.
       */
      if (argv.length <= 2) {
        const appNameFiglet = figlet.textSync(appName)
        const appNameFigletColorized = chalkRainbow(appNameFiglet)

        process.stdout.write(appNameFigletColorized + '\n')
      }
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

    const { loadApp, stayAlive, environments } = Options.create(command, {
      loadApp: false,
      stayAlive: false,
      environments: ['console']
    })

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
