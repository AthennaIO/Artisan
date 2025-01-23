/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Command, type Help } from 'commander'
import { Color, Options, Macroable } from '@athenna/common'

export class Formatter extends Macroable {
  public static builder(cmd: Command, help: Help) {
    return new Formatter(cmd, help)
  }

  private cmd: Command
  private help: Help
  private termWidth: number = 0
  private itemSeparatorWidth: number = 0
  private helpWidth: number = 0
  private indent: string = ''
  private moveOptions: any = false
  private matchRequiredArgs = /<(.*?)>/
  private matchOptionsAndOptionalArgs = /\[(.*?)\]/
  private sections = {
    description: '',
    usage: '',
    arguments: '',
    options: '',
    commands: '',
    globalOptions: ''
  }

  public constructor(cmd: Command, help: Help) {
    super()

    this.cmd = cmd
    this.help = help

    this.termWidth = help.padWidth(cmd, help)
    this.helpWidth = help.helpWidth || 80
    this.itemSeparatorWidth = 2
    this.indent = ' '.repeat(2)
    this.moveOptions = !cmd.parent && cmd.commands.length
  }

  public setUsage() {
    this.sections.usage = this.help.commandUsage(this.cmd)

    return this
  }

  public setDescription() {
    this.sections.description = this.help.commandDescription(this.cmd)

    return this
  }

  public setOptions() {
    this.sections.options = this.list(
      this.help
        .visibleOptions(this.cmd)
        .filter(option => {
          if (
            this.cmd.parent &&
            (option.long === '--help' || option.long === '--version')
          ) {
            this.cmd.parent.addOption(option)
            return false
          }

          return true
        })
        .map(opt =>
          this.option(
            this.help.optionTerm(opt),
            this.help.optionDescription(opt)
          )
        )
    )

    return this
  }

  public setCommands() {
    const commands = this.help.visibleCommands(this.cmd).map(c => {
      return this.command(
        this.help.subcommandTerm(c),
        this.help.subcommandDescription(c)
      )
    })

    this.sections.commands = this.list(commands) || ''

    return this
  }

  public setArguments() {
    const args = this.help.visibleArguments(this.cmd).map(argument => {
      return this.item(
        this.help.argumentTerm(argument),
        this.help.argumentDescription(argument)
      )
    })

    this.sections.arguments = this.list(args)

    return this
  }

  public setGlobalOptions() {
    this.sections.globalOptions = this.list(
      this.help
        .visibleGlobalOptions(this.cmd)
        .filter(opt => opt.long !== '--help' && opt.long !== '--version')
        .map(opt =>
          this.option(
            this.help.optionTerm(opt),
            this.help.optionDescription(opt)
          )
        )
    )

    return this
  }

  public getOutput() {
    const output = []

    output.push(
      Color.yellow.bold('Usage:'),
      this.indent + this.sections.usage,
      ''
    )

    if (this.sections.description) {
      output.push(
        Color.yellow.bold('Description:'),
        this.indent + this.sections.description,
        ''
      )
    }

    if (this.sections.arguments) {
      output.push(Color.yellow.bold('Arguments'), this.sections.arguments, '')
    }

    if (this.sections.options && !this.moveOptions) {
      output.push(Color.yellow.bold('Options:'), this.sections.options, '')
    }

    if (this.sections.commands.length) {
      output.push(
        Color.yellow.bold('Available Commands:'),
        this.sections.commands,
        ''
      )
    }

    if (this.sections.options && this.moveOptions) {
      output.push(Color.yellow.bold('Options:'), this.sections.options, '')
    }

    if (this.sections.globalOptions) {
      output.push(
        Color.yellow.bold('Global Options:'),
        this.sections.globalOptions,
        ''
      )
    }

    return output.join('\n')
  }

  public command(cmd: string, desc: string) {
    if (desc) {
      const formattedTerm = this.term(cmd, { padEnd: true, greenColor: false })

      return this.help.wrap(
        `${Color.green(formattedTerm)}${desc}`,
        this.helpWidth - this.indent.length,
        this.termWidth + this.itemSeparatorWidth
      )
    }

    return this.term(cmd)
  }

  public option(term: string, desc: string) {
    return this.command(term, desc)
  }

  public item(term: string, desc: string) {
    if (desc) {
      const formattedTerm = this.term(term, {
        padEnd: true,
        argsColor: false,
        greenColor: false
      })

      return this.help.wrap(
        `${formattedTerm}${desc}`,
        this.helpWidth - this.indent.length,
        this.termWidth + this.itemSeparatorWidth
      )
    }

    return term
  }

  public list(values: string[]) {
    const list = values.join('\n').replace(/^/gm, this.indent).trim()

    return list ? this.indent + list : ''
  }

  public term(
    term: string,
    options: {
      greenColor?: boolean
      padEnd?: boolean
      argsColor?: boolean
    } = {}
  ) {
    options = Options.create(options, {
      argsColor: true,
      greenColor: true,
      padEnd: false
    })

    let formattedTerm = ''

    if (options.padEnd) {
      formattedTerm = term.padEnd(this.termWidth + this.itemSeparatorWidth)
    }

    if (options.argsColor) {
      formattedTerm = formattedTerm
        .replace(this.matchRequiredArgs, Color.yellow('$&'))
        .replace(this.matchOptionsAndOptionalArgs, Color.yellow('$&'))
    }

    if (options.greenColor) {
      return Color.green.bold(formattedTerm)
    }

    return formattedTerm
  }
}
