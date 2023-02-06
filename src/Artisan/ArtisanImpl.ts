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
import { CommanderHandler } from '#src/Handlers/CommanderHandler'
import { COMMANDS_SETTINGS } from '#src/Constants/CommandsSettings'

export class ArtisanImpl {
  /**
   * Register the command if it is not registered yet.
   */
  public async register(command: any) {
    const key = 'artisan::commander'
    const Command = command.constructor

    COMMANDS_SETTINGS.set(Command.signature(), Command.settings())

    if (Reflect.hasMetadata(key, command)) {
      return
    }

    const commander = CommanderHandler.getCommander()

    Reflect.defineMetadata(
      key,
      commander
        .command(Command.signature())
        .description(Command.description())
        .action(CommanderHandler.bindHandler(command))
        .showHelpAfterError(),
      command,
    )
  }

  /**
   * Call an Artisan command.
   *
   * @example
   * ```ts
   * Artisan.call('serve', '--watch')
   * ```
   */
  public async call(command: string): Promise<void> {
    return this.parse(['ts-node', 'artisan', ...command.split(' ')])
  }

  /**
   * Search for the command settings, set the CLI version and parse the
   * "argv" to execute the command.
   */
  public async parse(argv: string[], appName?: string): Promise<void> {
    const { loadApp, stayAlive, environment } = COMMANDS_SETTINGS.get(
      argv[2],
    ) || {
      loadApp: false,
      stayAlive: false,
      environment: ['console'],
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
      const application = ioc.safeUse('Athenna/Core/Application')

      await application.boot(environment)
    }

    await CommanderHandler.setVersion(Config.get('app.version')).parse(argv)

    if (!stayAlive && !Env('ARTISAN_TESTING', false)) {
      process.exit(0)
    }
  }
}
