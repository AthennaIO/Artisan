/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { fake } from 'sinon'
import { test } from '@japa/runner'
import { Config } from '@athenna/config'
import { ViewProvider } from '@athenna/view'
import { LoggerProvider } from '@athenna/logger'
import { Exec, File, Folder } from '@athenna/common'
import { ExitFaker } from '#tests/Helpers/ExitFaker'
import { Artisan, ConsoleKernel, ArtisanProvider } from '#src'

test.group('ConfigureCommandTest', group => {
  const originalPJson = new File(Path.pwd('package.json')).getContentSync().toString()

  group.each.setup(async () => {
    process.env.IS_TS = 'true'
    process.env.ARTISAN_TESTING = 'true'

    ExitFaker.fake()

    await Config.loadAll(Path.stubs('config'))

    new ViewProvider().register()
    new LoggerProvider().register()
    new ArtisanProvider().register()

    const kernel = new ConsoleKernel()

    await kernel.registerExceptionHandler()
    await kernel.registerCommands(['ts-node', 'artisan', 'configure'])
  })

  group.each.teardown(async () => {
    ExitFaker.release()

    await Folder.safeRemove(Path.app())
    await Folder.safeRemove(Path.config())

    await File.safeRemove(Path.pwd('.env'))
    await File.safeRemove(Path.pwd('.env.test'))
    await File.safeRemove(Path.pwd('.env.example'))
    await File.safeRemove(Path.pwd('docker-compose.yml'))

    const stream = new File(Path.pwd('package.json')).createWriteStream()

    await new Promise((resolve, reject) => {
      stream.write(originalPJson)
      stream.end(resolve)
      stream.on('error', reject)
    })
  })

  test('should be able to configure paths inside the application', async ({ assert }) => {
    await Artisan.call('configure ./tests/Stubs/library/build/Configurer/index.js')

    const packageJson = await new File(Path.pwd('package.json'))
      .getContent()
      .then(content => JSON.parse(content.toString()))

    assert.containsSubset(Config.get('rc.commands'), ['./tests/Stubs/library/build/Commands/MakeModelCommand.js'])
    assert.containsSubset(packageJson.athenna.commands, ['./tests/Stubs/library/build/Commands/MakeModelCommand.js'])

    assert.containsSubset(Config.get('rc.providers'), ['./tests/Stubs/library/build/Providers/DatabaseProvider.js'])
    assert.containsSubset(packageJson.athenna.providers, ['./tests/Stubs/library/build/Providers/DatabaseProvider.js'])

    assert.containsSubset(packageJson.athenna.commandsManifest, {
      'make:model': './tests/Stubs/library/build/Commands/MakeModelCommand.js',
    })
    assert.containsSubset(Config.get('rc.commandsManifest'), {
      'make:model': './tests/Stubs/library/build/Commands/MakeModelCommand.js',
    })
  })

  test('should be able to configure libraries inside the application and throw error when configurer does not exist', async ({
    assert,
  }) => {
    const originalCommand = Exec.command
    const commandFake = fake()

    Exec.command = (...args: any[]) => Promise.resolve(commandFake(...args))

    await Artisan.call('configure some-lib-name')

    Exec.command = originalCommand

    assert.isTrue(commandFake.calledOnceWith('npm install some-lib-name'))
    assert.isTrue(ExitFaker.faker.calledWith(1)) // <- Means that some error happened
  })
})
