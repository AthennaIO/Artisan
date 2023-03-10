/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import inquirer from 'inquirer'

import { Prompt } from '#src/Helpers/Command/Prompt'
import { AfterAll, BeforeEach, Test, TestContext } from '@athenna/test'
import { InquirerPromptException } from '#src/Exceptions/InquirerPromptException'

export default class PromptTest {
  private prompt = new Prompt()

  @BeforeEach()
  public async beforeEach() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.prompt.inquirer = _ => Promise.resolve({ raw: 'value' })
  }

  @AfterAll()
  public async afterAll() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.prompt.inquirer = inquirer.createPromptModule()
  }

  @Test()
  public async shouldBeAbleToPromptInputs({ assert }: TestContext) {
    const value = await this.prompt.input('What is the value?')

    assert.equal(value, 'value')
  }

  @Test()
  public async shouldBeAbleToPromptSecrets({ assert }: TestContext) {
    const value = await this.prompt.secret('What is the value?')

    assert.equal(value, 'value')
  }

  @Test()
  public async shouldBeAbleToPromptConfirm({ assert }: TestContext) {
    const value = await this.prompt.confirm('What is the value?')

    assert.equal(value, 'value')
  }

  @Test()
  public async shouldBeAbleToPromptEditor({ assert }: TestContext) {
    const value = await this.prompt.editor('What is the value?')

    assert.equal(value, 'value')
  }

  @Test()
  public async shouldBeAbleToPromptList({ assert }: TestContext) {
    const value = await this.prompt.list('What is the value?', ['value', 'other value'])

    assert.equal(value, 'value')
  }

  @Test()
  public async shouldBeAbleToPromptExpand({ assert }: TestContext) {
    const value = await this.prompt.expand('What is the value?', [{ name: 'value', key: 'value' }])

    assert.equal(value, 'value')
  }

  @Test()
  public async shouldBeAbleToPromptCheckbox({ assert }: TestContext) {
    const value = await this.prompt.checkbox('What is the value?', ['value', 'other value'])

    assert.equal(value, ['value'])
  }

  @Test()
  public async shouldThrowInquirerPromptExceptionWhenPromptFails({ assert }: TestContext) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.prompt.inquirer = _ => Promise.reject(new Error('value'))

    try {
      await this.prompt.input('What is the value?')
    } catch (error) {
      assert.instanceOf(error, InquirerPromptException)
    }
  }
}
