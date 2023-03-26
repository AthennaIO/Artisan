/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { File, ObjectBuilder } from '@athenna/common'

export class Rc {
  public rcFile: File
  public content: ObjectBuilder

  public constructor() {
    this.setRcFile(Path.pwd('.athennarc.json'), true)
  }

  /**
   * Set the RC file that the Rc class should work with.
   */
  public setRcFile(path = Path.pwd('.athennarc.json'), pjson = false): Rc {
    this.content = new ObjectBuilder({ referencedValues: false })

    if (Config.is('rc.isInPackageJson', true) && pjson) {
      this.rcFile = new File(Path.pwd('package.json')).loadSync({
        withContent: true,
      })
      this.content.set(this.rcFile.getContentAsJsonSync().athenna)

      return this
    }

    this.rcFile = new File(path).loadSync({ withContent: true })
    this.content.set(this.rcFile.getContentAsJsonSync())

    return this
  }

  /**
   * Set or subscribe a KEY:VALUE property in some property of the RC configuration file.
   * You can also pass any value as second parameter to set multiple properties at once.
   *
   * @example
   * ```ts
   * this.rc.setTo('commands', 'test', '#app/Console/Commands/TestCommand')
   * ```
   * Or:
   * @example
   * ```ts
   * this.rc.setTo('commands', { test: '#app/Console/Commands/TestCommand' })
   * ```
   */
  public setTo(rcKey: string, key: string | any, value?: any): Rc {
    if (value) {
      value = { ...this.content.get(rcKey, {}), [key]: value }
    }

    this.content.set(rcKey, value || key)

    Config.set(`rc.${rcKey}`, this.content.get(rcKey))

    return this
  }

  /**
   * Push a new value in some property of the RC configuration file.
   *
   * @example
   * ```ts
   * this.rc.pushTo('providers', '#providers/TestProvider')
   * ```
   */
  public pushTo(rcKey: string, value: any): Rc {
    this.content.set(rcKey, [...this.content.get(rcKey, []), value])

    Config.set(`rc.${rcKey}`, this.content.get(rcKey))

    return this
  }

  /**
   * Save the new content in the Rc file.
   */
  public async save(): Promise<void> {
    if (Config.is('rc.isInPackageJson', true)) {
      const packageJson = this.rcFile.getContentAsJsonSync()

      packageJson.athenna = this.content.get()

      await this.rcFile.setContent(this.toStringJson(packageJson))

      return
    }

    let athennaRcJson = this.rcFile.getContentAsJsonSync()

    athennaRcJson = this.content.get()

    await this.rcFile.setContent(this.toStringJson(athennaRcJson))
  }

  /**
   * Parse the object value to JSON string.
   */
  private toStringJson(value: any): string {
    return JSON.stringify(value, null, 2).concat('\n')
  }
}
