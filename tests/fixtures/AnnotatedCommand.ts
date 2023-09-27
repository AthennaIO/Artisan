/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Option, Argument, BaseCommand } from '#src'
import { FixtureDatabase } from './FixtureDatabase.js'

export class AnnotatedCommand extends BaseCommand {
  @Argument()
  public name: string

  @Argument({
    required: true,
    description: 'The age of the person'
  })
  public age: string

  @Argument({
    required: false,
    signature: 'your-email',
    default: 'lenon@athenna.io',
    description: 'The email of the person'
  })
  public email: string

  @Option()
  public withName: boolean

  @Option({ description: 'Add the age of the person' })
  public withAge: boolean

  @Option({ default: true, signature: '-am, --add-email', description: 'Add the email of the person' })
  public withEmail: boolean

  @Option({ default: false, signature: '--no-foo' })
  public withFoo: boolean

  public static signature() {
    return 'annotated'
  }

  public async handle() {
    FixtureDatabase.set('annotated:command', {
      name: this.name,
      age: this.age,
      email: this.email,
      withName: this.withName,
      withAge: this.withAge,
      withEmail: this.withEmail,
      withFoo: this.withFoo
    })
  }
}

export const annotatedCommand = new AnnotatedCommand()
