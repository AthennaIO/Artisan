/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Config } from '@athenna/config'
import { Rc } from '#src/Helpers/Command/Rc'
import { File, Folder, Path } from '@athenna/common'
import { AfterEach, BeforeEach, Test, TestContext } from '@athenna/test'

export default class RcTest {
  private rc: Rc = null
  private originalRcContent = new File(Path.stubs('.athennarc.json')).getContentAsJsonSync()

  @BeforeEach()
  public async beforeEach() {
    Config.set('rc.isInPackageJson', true)

    await Config.load(Path.stubs('config/rc.ts'))

    this.rc = new Rc()
  }

  @AfterEach()
  public async afterEach() {
    await Folder.safeRemove(Path.stubs('tmp'))
    await new File(Path.stubs('.athennarc.json')).setContent(
      JSON.stringify(this.originalRcContent, null, 2).concat('\n'),
    )
  }

  @Test()
  public async shouldBeAbleToSetTheRcFileThatRcHelperShouldUse({ assert }: TestContext) {
    Config.set('rc.isInPackageJson', false)
    const path = Path.stubs('.athennarc.json')

    this.rc.setRcFile(path)

    assert.deepEqual(await this.rc.rcFile.getContentAsJson(), await new File(path).getContentAsJson())
  }

  @Test()
  public async shouldBeAbleToSetSomeKeyValueToAnRcKey({ assert }: TestContext) {
    Config.set('rc.isInPackageJson', false)
    const path = Path.stubs('.athennarc.json')

    await this.rc
      .setRcFile(path)
      .setTo('commands', 'one', 'value')
      .setTo('commands', 'two', 'value')
      .setTo('commands', 'three', 'value')
      .setTo('commands', 'test', 'value')
      .save()

    assert.containsSubset(await new File(path).getContentAsJson(), {
      commands: {
        one: 'value',
        two: 'value',
        test: 'value',
        three: 'value',
      },
    })
  }

  @Test()
  public async shouldBeAbleToChangeTheEntireValueOfSomeProperty({ assert }: TestContext) {
    Config.set('rc.isInPackageJson', false)
    const path = Path.stubs('.athennarc.json')

    await this.rc
      .setRcFile(path)
      .setTo('commands', {
        one: 'value',
        two: 'value',
        test: 'value',
        three: 'value',
      })
      .save()

    assert.deepEqual((await new File(path).getContentAsJson()).commands, {
      one: 'value',
      two: 'value',
      test: 'value',
      three: 'value',
    })
  }

  @Test()
  public async shouldBeAbleToPushSomeValueToAnRcArrayKey({ assert }: TestContext) {
    Config.set('rc.isInPackageJson', false)
    const path = Path.stubs('.athennarc.json')

    await this.rc
      .setRcFile(path)
      .pushTo('providers', 'value')
      .pushTo('providers', 'value')
      .pushTo('providers', 'value')
      .save()

    assert.containsSubset(await new File(path).getContentAsJson(), {
      providers: ['value', 'value', 'value'],
    })
  }
}
