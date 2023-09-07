import { ConsoleExceptionHandler } from '#src'

export class Handler extends ConsoleExceptionHandler {
  public async handle(error: any): Promise<void> {
    return super.handle(error)
  }
}
