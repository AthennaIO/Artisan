/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Prompt } from '#src/helpers/command/Prompt'
import { Test, type Context, Mock, AfterEach } from '@athenna/test'
import { InquirerPromptException } from '#src/exceptions/InquirerPromptException'

export default class PromptTest {
  private prompt = new Prompt()

  @AfterEach()
  public async afterAll() {
    Mock.restoreAll()
  }

  @Test()
  public async shouldBeAbleToPromptInputs({ assert }: Context) {
    Mock.when(this.prompt, 'inquirer').resolve({ raw: 'value' })

    const value = await this.prompt.input('What is the value?')

    assert.equal(value, 'value')
  }

  @Test()
  public async shouldBeAbleToPromptSecrets({ assert }: Context) {
    Mock.when(this.prompt, 'inquirer').resolve({ raw: 'value' })

    const value = await this.prompt.secret('What is the value?')

    assert.equal(value, 'value')
  }

  @Test()
  public async shouldBeAbleToPromptConfirm({ assert }: Context) {
    Mock.when(this.prompt, 'inquirer').resolve({ raw: 'value' })

    const value = await this.prompt.confirm('What is the value?')

    assert.equal(value, 'value')
  }

  @Test()
  public async shouldBeAbleToPromptEditor({ assert }: Context) {
    Mock.when(this.prompt, 'inquirer').resolve({ raw: 'value' })

    const value = await this.prompt.editor('What is the value?')

    assert.equal(value, 'value')
  }

  @Test()
  public async shouldBeAbleToPromptList({ assert }: Context) {
    Mock.when(this.prompt, 'inquirer').resolve({ raw: 'value' })

    const value = await this.prompt.list('What is the value?', ['value', 'other value'])

    assert.equal(value, 'value')
  }

  @Test()
  public async shouldBeAbleToPromptExpand({ assert }: Context) {
    Mock.when(this.prompt, 'inquirer').resolve({ raw: 'value' })

    const value = await this.prompt.expand('What is the value?', [{ name: 'value', key: 'value' }])

    assert.equal(value, 'value')
  }

  @Test()
  public async shouldBeAbleToPromptCheckbox({ assert }: Context) {
    Mock.when(this.prompt, 'inquirer').resolve({ raw: 'value' })

    const value = await this.prompt.checkbox('What is the value?', ['value', 'other value'])

    assert.equal(value, ['value'])
  }

  @Test()
  public async shouldThrowInquirerPromptExceptionWhenPromptFails({ assert }: Context) {
    assert.plan(1)

    Mock.when(this.prompt, 'inquirer').reject(new Error('value'))

    try {
      await this.prompt.input('What is the value?')
    } catch (error) {
      assert.instanceOf(error, InquirerPromptException)
    }
  }
}
