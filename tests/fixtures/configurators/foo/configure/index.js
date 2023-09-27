/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseConfigurer } from '../../../../../src/artisan/BaseConfigurer.js'

export default class FooConfigurer extends BaseConfigurer {
  async configure() {
    const db = await this.prompt.list('Select your database', ['PostgreSQL', 'MySQL / MariaDB', 'MongoDB'])
    this.logger.info(`You selected ${db}`)
  }
}
