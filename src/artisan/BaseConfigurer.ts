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
import { parse, resolve } from 'node:path'
import { Prompt } from '#src/helpers/command/Prompt'
import { Logger } from '#src/helpers/command/Logger'
import { Generator } from '#src/helpers/command/Generator'

export abstract class BaseConfigurer {
  /**
   * The paths property is an object with the pwd and
   * configurer paths.
   *
   * Remembers that when running your Configurer, the
   * Path class will be referencing the path of your
   * application.
   */
  public paths: {
    lib?: string
    configurer?: string
  } = {}

  /**
   * The Rc helper used to manage the .athennarc.json
   * file. Very useful to add commands, providers and
   * preloads properties in the file.
   */
  public rc = Rc

  /**
   * The Athenna colors ui kit. This methods uses the
   * Color helper class from @athenna/common package.
   * All the methods will return an instance of Chalk
   * API.
   */
  public paint = Color

  /**
   * The console logger. The console logger extends the
   * Logger class from "@athenna/logger" package.
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
   * Set the path of the configurer.
   */
  public setPath(path: string): BaseConfigurer {
    this.paths = {
      lib: resolve(parse(path).dir, '..'),
      configurer: path,
    }

    return this
  }

  /**
   * The configurer handler. This method will be called
   * to execute your configurer.
   */
  public abstract configure(): Promise<void>
}
