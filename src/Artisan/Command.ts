/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Color } from '@athenna/common'
import { Rc } from '#src/Helpers/Command/Rc'
import { Commander } from '#src/Artisan/Commander'
import { Prompt } from '#src/Helpers/Command/Prompt'
import { Logger } from '#src/Helpers/Command/Logger'
import { Generator } from '#src/Helpers/Command/Generator'
import { CommandSettings } from '#src/Types/CommandSettings'

export abstract class Command {
  /**
   * The command signature/name. This option will
   * define how the command should be called.
   */
  public static signature(): string {
    return ''
  }

  /**
   * The command description. This option will define
   * the command description when calling it with --help
   * argument.
   */
  public static description(): string {
    return ''
  }

  /**
   * Set the command settings.
   *
   * @default
   *  {
   *    loadApp: false,
   *    stayAlive: false,
   *    environments: ['console']
   *  }
   */
  public static settings(): CommandSettings {
    return {
      loadApp: false,
      stayAlive: false,
      environments: ['console'],
    }
  }

  /**
   * The Rc helper used to manage the .athennarc.json
   * file. Very useful to add commands, providers and
   * preloads properties in the file.
   */
  public rc = new Rc()

  /**
   * The Athenna colors ui kit. This methods uses the
   * Color helper class from @athenna/common package.
   * All the methods will return an instance of Chalk
   * API.
   */
  public paint = Color

  /**
   * The console logger. The console logger extends the
   * VanillaLogger class from "@athenna/logger" package.
   *
   * The driver used is the "console" with the "cli" formatter.
   */
  public logger = new Logger()

  /**
   * The prompt used to make questions. The prompt uses the
   * Inquirer API to prompt the questions and retrieve the
   * answers.
   */
  public prompt = new Prompt()

  /**
   * The geneartor used to make files. The generator uses the
   * athenna/view package to generate files from templates. A
   * briefly knowlodge about how to setup templates inside
   * athenna/view is very good to use this helper.
   */
  public generator = new Generator()

  /**
   * Execute the command setting args and options in the class
   */
  protected __exec(...args: any[]): Promise<void> {
    if (!this.rc) this.rc = new Rc()
    if (!this.paint) this.paint = Color
    if (!this.logger) this.logger = new Logger()
    if (!this.prompt) this.prompt = new Prompt()
    if (!this.generator) this.generator = new Generator()

    const artisanOpts = Reflect.getMetadata('artisan::options', this)
    const artisanArgs = Reflect.getMetadata('artisan::arguments', this)
    const commander: Commander = Reflect.getMetadata('artisan::commander', this)

    const opts = commander.opts()

    artisanArgs?.forEach(arg => (this[arg] = args.shift()))
    Object.keys(opts).forEach(key => (this[artisanOpts[key]] = opts[key]))

    return this.handle()
  }

  /**
   * The command handler. This method will be called
   * to execute your command.
   */
  public abstract handle(): Promise<void>
}
