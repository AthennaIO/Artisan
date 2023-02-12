/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { File } from '@athenna/common'

export class Rc {
  public rcFile: File
  public rc: {
    athenna: Record<string, any>
  }

  public constructor() {
    this.setRcFile(
      Config.is('rc.isInPackageJson', true)
        ? Path.pwd('package.json')
        : undefined,
    )
  }

  /**
   * Set the RC file that the Rc class should work with.
   */
  public setRcFile(path = Path.pwd('.athennarc.json')): Rc {
    this.rcFile = new File(path)
    this.rc = JSON.parse(this.rcFile.getContentSync().toString())

    return this
  }

  /**
   * Add a new command path to the "rc.commands" array and
   * "rc.commandsManifest" object.
   */
  public addCommand(signature: string, path: string): Rc {
    Config.set('rc.commands', [...Config.get('rc.commands', []), path])
    Config.set('rc.commandsManifest', {
      ...Config.get('rc.commandsManifest', {}),
      [signature]: path,
    })

    this.rc.athenna.commands = Config.get('rc.commands')
    this.rc.athenna.commandsManifest = Config.get('rc.commandsManifest')

    return this
  }

  /**
   * Add a new provider path to the "rc.providers" array.
   */
  public addProvider(path: string): Rc {
    Config.set('rc.providers', [...Config.get('rc.providers', []), path])

    this.rc.athenna.providers = Config.get('rc.providers')

    return this
  }

  /**
   * Add a new preload path to the "rc.preloads" array.
   */
  public addPreload(path: string): Rc {
    Config.set('rc.preloads', [...Config.get('rc.preloads', []), path])

    this.rc.athenna.preloads = Config.get('rc.preloads')

    return this
  }

  /**
   * Save the new content in the Rc file.
   */
  public async save(): Promise<void> {
    const stream = this.rcFile.createWriteStream()

    return new Promise((resolve, reject) => {
      stream.write(
        JSON.stringify(
          Config.is('rc.isInPackageJson', true) ? this.rc : this.rc.athenna,
          null,
          2,
        ).concat('\n'),
      )
      stream.end(resolve)
      stream.on('error', reject)
    })
  }
}
