/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import yaml from 'js-yaml'

import { Env, Config } from '@athenna/config'
import { File, Exec, Path } from '@athenna/common'
import { Configurer } from '../../../../../src/Artisan/Configurer.js'

export default class LibraryConfigurer extends Configurer {
  prompt = Env('ARTISAN_TESTING', false)
    ? {
        list: (_, __) => Promise.resolve('PostgreSQL'),
      }
    : super.prompt

  async configure() {
    const db = await this.prompt.list('Select the database driver you want to use', [
      'PostgreSQL',
      'MySQL / MariaDB',
      'MongoDB',
    ])

    const libTitles = {
      MongoDB: 'Install mongoose library',
      PostgreSQL: 'Install knex and pg libraries',
      'MySQL / MariaDB': 'Install knex and mysql2 libraries',
    }

    await this.logger
      .task()
      .add(libTitles[db], async t => this.setTask(t, () => this.taskOne(db)))
      .add(`Create config/database.${Path.ext()} file`, async t => this.setTask(t, () => this.taskTwo(db)))
      .add('Update commands and providers of .athennarc.json', async t => this.setTask(t, () => this.taskThree()))
      .add('Update .env, .env.test and .env.example', async t => this.setTask(t, () => this.taskFour(db)))
      .add('Update docker-compose.yml file', async t => this.setTask(t, () => this.taskFive(db)))
      .run()
  }

  async setTask(task, callback) {
    try {
      await callback()
      await task.complete()
    } catch (err) {
      await task.fail(err)
    }
  }

  async taskOne(db) {
    const libraries = {
      MongoDB: 'mongoose',
      PostgreSQL: 'knex pg',
      'MySQL / MariaDB': 'knex mysql2',
    }

    const npmInstallCommand = `cd ${Path.pwd()} && npm install ${libraries[db]} --production=false`

    return Exec.command(npmInstallCommand)
  }

  async taskTwo(db) {
    const paths = {
      MongoDB: this.paths.configurer.concat(`/config/mongo/database.${Path.ext()}`),
      PostgreSQL: this.paths.configurer.concat(`/config/postgres/database.${Path.ext()}`),
      'MySQL / MariaDB': this.paths.configurer.concat(`/config/mysql/database.${Path.ext()}`),
    }

    return new File(paths[db]).copy(Path.config(`database.${Path.ext()}`))
  }

  async taskThree() {
    Config.set('rc.providers', [
      ...Config.get('rc.providers', []),
      './tests/Stubs/library/build/Providers/DatabaseProvider.js',
    ])
    Config.set('rc.commands', [
      ...Config.get('rc.commands', []),
      './tests/Stubs/library/build/Commands/MakeModelCommand.js',
    ])
    Config.set('rc.commandsManifest', {
      ...Config.get('rc.commandsManifest', {}),
      'make:model': './tests/Stubs/library/build/Commands/MakeModelCommand.js',
    })

    const path = Config.is('rc.isInPackageJson', true) ? Path.pwd('package.json') : Path.pwd('.athennarc.json')

    const file = new File(path, Buffer.from('{}'))
    const json = await file.getContent().then(content => JSON.parse(content.toString()))

    if (Config.is('rc.isInPackageJson', true)) {
      json.athenna.commands = Config.get('rc.commands')
      json.athenna.providers = Config.get('rc.providers')
      json.athenna.commandsManifest = Config.get('rc.commandsManifest')
    } else {
      json.commands = Config.get('rc.commands')
      json.providers = Config.get('rc.providers')
      json.commandsManifest = Config.get('rc.commandsManifest')
    }

    const stream = file.createWriteStream()

    return new Promise((resolve, reject) => {
      stream.write(JSON.stringify(json, null, 2).concat('\n'))
      stream.end(resolve)
      stream.on('error', reject)
    })
  }

  async taskFour(db) {
    const envVars = {
      MongoDB: '\nDB_CONNECTION=mongo\n' + 'DB_URL=mongodb://localhost:27017/database\n',
      PostgreSQL:
        '\nDB_CONNECTION=postgres\n' +
        'DB_HOST=127.0.0.1\n' +
        'DB_PORT=5432\n' +
        'DB_DATABASE=database\n' +
        'DB_DEBUG=false\n' +
        'DB_USERNAME=root\n' +
        'DB_PASSWORD=root\n',
      'MySQL / MariaDB':
        '\nDB_CONNECTION=mysql\n' +
        'DB_HOST=127.0.0.1\n' +
        'DB_PORT=3306\n' +
        'DB_DATABASE=database\n' +
        'DB_DEBUG=false\n' +
        'DB_USERNAME=root\n' +
        'DB_PASSWORD=root\n',
    }

    return new File(Path.pwd('.env'), Buffer.from(''))
      .append(envVars[db])
      .then(() => new File(Path.pwd('.env.test'), Buffer.from('')).append(envVars[db]))
      .then(() => new File(Path.pwd('.env.example'), Buffer.from('')).append(envVars[db]))
  }

  async taskFive(db) {
    const services = {
      MongoDB: {
        mongo: {
          container_name: 'athenna_mongo',
          image: 'mongo',
          ports: ['27017:27017'],
        },
      },
      PostgreSQL: {
        postgres: {
          container_name: 'athenna_postgres',
          image: 'postgres',
          ports: ['5433:5432'],
          environment: {
            POSTGRES_DB: 'postgres',
            POSTGRES_USER: 'postgres',
            POSTGRES_PASSWORD: 12345,
            POSTGRES_ROOT_PASSWORD: 12345,
          },
        },
      },
      'MySQL / MariaDB': {
        mysql: {
          container_name: 'athenna_mysql',
          image: 'mysql',
          ports: ['5433:5432'],
          environment: {
            MYSQL_DATABASE: 'athenna',
            MYSQL_ROOT_PASSWORD: '12345',
            MYSQL_ALLOW_EMPTY_PASSWORD: 'yes',
          },
        },
      },
    }

    const baseDockerCompose = await new File(this.paths.configurer.concat('/docker-compose.yml')).getContent()
    const file = await new File(Path.pwd('docker-compose.yml'), baseDockerCompose).load()
    const dockerCompose = yaml.load(file.content)

    const key = Object.keys(services[db])[0]

    if (!dockerCompose.services) {
      dockerCompose.services = {}
    }

    dockerCompose.services[key] = services[db][key]

    const stream = file.createWriteStream()

    return new Promise((resolve, reject) => {
      stream.write(yaml.dump(dockerCompose).concat('\n'))
      stream.end(resolve)
      stream.on('error', reject)
    })
  }
}
