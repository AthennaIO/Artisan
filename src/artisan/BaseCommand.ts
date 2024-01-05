/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Rc } from '@athenna/config'
import { Color } from '@athenna/common'
import { Prompt } from '#src/helpers/command/Prompt'
import { Logger } from '#src/helpers/command/Logger'
import { Annotation } from '#src/helpers/Annotation'
import type { Commander } from '#src/artisan/Commander'
import { Generator } from '#src/helpers/command/Generator'
import { CommanderHandler } from '#src/handlers/CommanderHandler'

export abstract class BaseCommand {
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
   * Define custom options for commander.
   */
  public static commander(commander: Commander): Commander {
    return commander
  }

  /**
   * The Rc helper used to manage the .athennarc.json
   * file. Very useful to add commands, providers and
   * preloads properties in the file.
   */
  public rc = Rc

  /**
   * The Athenna colors ui kit. This method uses the
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
   * The generator used to make files. The generator uses the
   * athenna/view package to generate files from templates. A
   * briefly knowledge about how to setup templates inside
   * athenna/view is very good to use this helper.
   */
  public generator = new Generator()

  /**
   * Execute the command setting args and options in the class
   */
  protected __exec(...args: any[]): Promise<void> {
    const Command = this.constructor as typeof BaseCommand

    const optsMeta = Annotation.getOptions(this)
    const argsMeta = Annotation.getArguments(this)
    const optsValues = CommanderHandler.getCommandOptsValues(
      Command.signature()
    )

    argsMeta.forEach(arg => (this[arg.key] = args.shift()))
    optsMeta.forEach(opt => (this[opt.key] = optsValues[opt.signatureName]))

    return this.handle(...args)
  }

  /**
   * The command handler. This method will be called
   * to execute your command.
   */
  public abstract handle(...args: any[]): Promise<void>
}
