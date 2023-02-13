/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import inquirer, {
  Question,
  ListChoiceOptions,
  ListQuestionOptions,
  ExpandChoiceOptions,
  ExpandQuestionOptions,
  CheckboxChoiceOptions,
  CheckboxQuestionOptions,
} from 'inquirer'

import { Options } from '@athenna/common'
import { InquirerPromptException } from '#src/Exceptions/InquirerPromptException'

export class Prompt {
  /**
   * The inquirer prompt API.
   */
  public inquirer = inquirer.createPromptModule()

  /**
   * Ask a simple input question.
   *
   * @example
   * ```ts
   * const name = await this.prompt
   *  .input('What is your name?') // Lenon
   * ```
   * Output:
   * ```bash
   * ? What is your name? Lenon
   * ```
   */
  public async input(msg: string, opts: Question = {}): Promise<string> {
    return this.raw(msg, Options.create(opts, { type: 'input' }))
  }

  /**
   * Ask a secure question for a secret answer.
   *
   * @example
   * ```ts
   * const password = await this.prompt
   *  .secret('What is your password?') // 123
   * ```
   * Output:
   * ```bash
   * ? What is your password? [hidden]
   * ```
   */
  public async secret(msg: string, opts: Question = {}): Promise<string> {
    return this.raw(msg, Options.create(opts, { type: 'secret' }))
  }

  /**
   * Ask a confirmation.
   *
   * @example
   * ```ts
   * const isRobot = await this.prompt
   *  .confirm('Are you a robot?') // true
   * ```
   * Output:
   * ```bash
   * ? Are you a robot? y
   * ```
   */
  public async confirm(msg: string, opts?: Question): Promise<boolean> {
    return this.raw(msg, Options.create(opts, { type: 'confirm' }))
  }

  /**
   * Ask to answer inside a code/text editor. This method will open
   * the default editor of your OS.
   *
   * @example
   * ```ts
   * const script = await this.prompt
   *  .editor('Please add your script') // console.log('hello')\n
   * ```
   * Output:
   * ```bash
   * ? Please add your script Received
   * ```
   */
  public async editor(msg: string, opts?: Question): Promise<string> {
    return this.raw(msg, Options.create(opts, { type: 'editor' }))
  }

  /**
   * Ask with a predefined list of choices. Only one could be selected.
   *
   * @example
   * ```ts
   * const cardType = await this.prompt
   *  .list('Select your card type', ['debit', 'credit']) // debit
   * ```
   * Output:
   * ```bash
   * ? Select your card type (Use arrow keys)
   * ❯ debit
   *   credit
   * ```
   */
  public async list(
    msg: string,
    choices: string[] | ListChoiceOptions[],
    opts: ListQuestionOptions = {},
  ): Promise<string> {
    return this.raw(msg, Options.create(opts, { type: 'list', choices }))
  }

  /**
   * Ask with a predefined list of choices but expanded. The choices of expand
   * method have a required field called "key", the "key" is responsible to set
   * which key of the keyboard the user needs to type to select the option. The
   * key "h"/"H" is a default and very useful to see all the choices available.
   * Also only one could be selected.
   *
   * @example
   * ```ts
   * const cardType = await this.prompt
   *  .expand('Select your card type', [
   *    { key: 'd', name: 'debit' },
   *    { key: 'c', name: 'credit' },
   *  ]) // debit
   * ```
   * Output:
   * ```bash
   * ? Select your card type (abH)
   * ❯ debit
   *   credit
   * ```
   */
  public async expand(
    msg: string,
    choices: ExpandChoiceOptions[],
    opts?: ExpandQuestionOptions,
  ): Promise<string> {
    return this.raw(msg, Options.create(opts, { type: 'expand', choices }))
  }

  /**
   * Ask with a predefined list of choices. Multiple could be selected.
   *
   * @example
   * ```ts
   * const roles = await this.prompt
   *  .checkbox('Select the roles', ['customer', 'admin']) // ['customer',  'admin']
   * ```
   * Output:
   * ```bash
   * ? Select the roles (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
   * ❯ ◉ customer
   *   ◯ admin
   * ```
   */
  public async checkbox(
    msg: string,
    choices: string[] | CheckboxChoiceOptions[],
    opts?: CheckboxQuestionOptions,
  ): Promise<string[]> {
    return this.raw(msg, Options.create(opts, { type: 'checkbox', choices }))
  }

  /**
   * Ask one raw question using Inquirer.
   *
   * @example
   * ```ts
   * const property = this.prompt.raw('What is the property?', {
   *  type: 'input',
   * }) // Hello
   * ```
   * Output:
   * ```bash
   * ? What is the property? Hello
   * ```
   */
  public async raw<T = any>(msg: string, question: Question): Promise<T> {
    question.name = 'raw'
    question.message = msg

    return this.inquirer([question])
      .then(answers => answers.raw)
      .catch(err => {
        throw new InquirerPromptException(err)
      })
  }
}
