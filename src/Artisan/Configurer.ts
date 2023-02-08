/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Color } from '@athenna/common'
import { parse, resolve } from 'node:path'
import { Prompt } from '#src/Helpers/Command/Prompt'
import { Logger } from '#src/Helpers/Command/Logger'
import { Generator } from '#src/Helpers/Command/Generator'

export abstract class Configurer {
  /**
   * The paths property is an object with the pwd and
   * configurer paths.
   *
   * Remembers that when running your Configurer, the
   * Path class will be referencing the path of your
   * application.
   */
  public paths = {}

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
  public setPath(path: string): Configurer {
    this.paths = {
      configurerClass: path,
      configurer: parse(path).dir,
      pwd: resolve(path, '..', '..', '..'),
    }

    return this
  }

  /**
   * The configurer handler. This method will be called
   * to execute your configurer.
   */
  public abstract configure(): Promise<void>
}
