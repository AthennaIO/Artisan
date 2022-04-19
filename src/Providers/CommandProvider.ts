/**
 * @athenna/core
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ServiceProvider } from '@athenna/ioc'
import { Path, resolveModule } from '@secjs/utils'
import { getAppFiles } from 'src/Utils/getAppFiles'

export class CommandProvider extends ServiceProvider {
  /**
   * Bootstrap any application services.
   *
   * @return void
   */
  public async boot(): Promise<void> {
    let commands = getAppFiles(Path.app('Console/Commands'))
    commands = await Promise.all(commands.map(File => import(File.path)))

    commands.forEach(Module => {
      const Command = resolveModule(Module)
      this.container.bind(`App/Console/Commands/${Command.name}`, Command)
    })
  }
}
