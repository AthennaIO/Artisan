import { File } from '@secjs/utils'

export class FilePropertiesHelper {
  /**
   * Add content to array property in file.
   *
   * @param {string} path
   * @param {string} matcher
   * @param {string} content
   * @return {Promise<File>}
   */
  static async addContentToArrayProperty(path, matcher, content) {
    const file = await new File(path).load()
    let fileContent = file.getContentSync().toString()

    const matches = fileContent.match(
      new RegExp(
        `(?:${matcher.replace(
          ' ',
          '\\s*',
        )}\\s*)\\[(?:[^\\]\\[]+|\\[(?:[^\\]\\[]+|\\[[^\\]\\[]*\\])*\\])*\\]`,
      ),
    )

    if (!matches) {
      return file
    }

    const match = matches[0]

    const arrayString = match
      .replace(matcher, '')
      .replace(/ /g, '')
      .replace(/\n/g, '')
      .replace(/(\[|\])/g, '')
      .split(',')

    /**
     * In case "matcher" is an empty array.
     * Example: "matcher" = []
     */
    if (arrayString.length) {
      const last = arrayString.length - 1

      if (arrayString[last] === '') {
        arrayString.pop()
      }
    }

    arrayString.push(content)

    fileContent = fileContent.replace(
      match,
      `${matcher}[${arrayString.join(',')}]`,
    )

    await file.remove()

    return new File(file.path, Buffer.from(fileContent)).load()
  }

  /**
   * Add content to object property in file.
   *
   * @param {string} path
   * @param {string} matcher
   * @param {string} content
   * @return {Promise<File>}
   */
  static async addContentToObjectProperty(path, matcher, content) {
    const file = await new File(path).load()
    let fileContent = file.getContentSync().toString()

    const matches = fileContent.match(
      new RegExp(
        `(?:${matcher.replace(
          ' ',
          '\\s*',
        )}\\s*)\\{(?:[^}{]+|\\{(?:[^}{]+|\\{[^}{]*\\})*\\})*\\}`,
      ),
    )

    if (!matches) {
      return file
    }

    const match = matches[0]

    const arrayString = match
      .replace(matcher, '')
      .replace(/ /g, '')
      .replace(/\n/g, '')
      .replace(/(\{|\})/g, '')
      .split(',')

    /**
     * In case "matcher" is an empty array.
     * Example: "matcher" = {}
     */
    if (arrayString.length) {
      const last = arrayString.length - 1

      if (arrayString[last] === '') {
        arrayString.pop()
      }
    }

    arrayString.push(content)

    fileContent = fileContent.replace(
      match,
      `${matcher}{${arrayString.join(',')}}`,
    )

    await file.remove()

    return new File(file.path, Buffer.from(fileContent)).load()
  }

  /**
   * Add content to function property in file.
   *
   * @param {string} path
   * @param {string} matcher
   * @param {string} content
   * @return {Promise<File>}
   */
  static async addContentToFunctionProperty(path, matcher, content) {
    const file = await new File(path).load()
    let fileContent = file.getContentSync().toString()

    const matches = fileContent.match(
      new RegExp(
        `(?:${matcher.replace(
          ' ',
          '\\s*',
        )}\\s*)\\((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*\\)`,
      ),
    )

    if (!matches) {
      return file
    }

    const match = matches[0]

    const arrayString = match
      .replace(matcher, '')
      .replace(/ /g, '')
      .replace(/\n/g, '')
      .replace(/(\(|\))/g, '')
      .split(',')

    /**
     * In case "matcher" is an empty array.
     * Example: "matcher" = []
     */
    if (arrayString.length) {
      const last = arrayString.length - 1

      if (arrayString[last] === '') {
        arrayString.pop()
      }
    }

    arrayString.push(content)

    fileContent = fileContent.replace(
      match,
      `${matcher}(${arrayString.join(',')})`,
    )

    await file.remove()

    return new File(file.path, Buffer.from(fileContent)).load()
  }

  /**
   * Replace the content of the array getter inside a file.
   *
   * @param {string} path
   * @param {string} getter
   * @param {string} content
   * @return {Promise<File>}
   */
  static async addContentToArrayGetter(path, getter, content) {
    const file = await new File(path).load()
    let fileContent = file.getContentSync().toString()

    const getMethod = `get\\s*${getter}\\(\\)\\s*\\{\\n\\s*return\\s*`

    const matches = fileContent.match(
      new RegExp(
        `(?:${getMethod})\\[(?:[^\\]\\[]+|\\[(?:[^\\]\\[]+|\\[[^\\]\\[]*\\])*\\])*\\]`,
      ),
    )

    if (!matches) {
      return file
    }

    const match = matches[0]

    const arrayString = match
      .replace(new RegExp(getMethod), '')
      .replace(/ /g, '')
      .replace(/\n/g, '')
      .replace(/(\[|\])/g, '')
      .split(',')

    /**
     * In case "matcher" is an empty array.
     * Example: "matcher" = []
     */
    if (arrayString.length) {
      const last = () => arrayString.length - 1

      if (arrayString[last()] === '') {
        arrayString.pop()
      }
    }

    arrayString.push(content)

    fileContent = fileContent.replace(
      match,
      `get ${getter}() {\n return [${arrayString.join(',')}]`,
    )

    await file.remove()
    return new File(file.path, Buffer.from(fileContent)).load()
  }

  /**
   * Replace the content of the object getter inside a file.
   *
   * @param {string} path
   * @param {string} getter
   * @param {string} content
   * @return {Promise<File>}
   */
  static async addContentToObjectGetter(path, getter, content) {
    const file = await new File(path).load()
    let fileContent = file.getContentSync().toString()

    const getMethod = `get\\s*${getter}\\(\\)\\s*\\{\\n\\s*return\\s*`

    const matches = fileContent.match(
      new RegExp(
        `(?:${getMethod})\\{(?:[^}{]+|\\{(?:[^}{]+|\\{[^}{]*\\})*\\})*\\}`,
      ),
    )

    if (!matches) {
      return
    }

    const match = matches[0]

    const arrayString = match
      .replace(new RegExp(getMethod), '')
      .replace(/ /g, '')
      .replace(/\n/g, '')
      .replace(/(\{|\})/g, '')
      .split(',')

    /**
     * In case "matcher" is an empty object.
     * Example: "matcher" = {}
     */
    if (arrayString.length) {
      const last = () => arrayString.length - 1

      if (arrayString[last()] === '') {
        arrayString.pop()
      }
    }

    arrayString.push(content)

    fileContent = fileContent.replace(
      match,
      `get ${getter}() {\n return {${arrayString.join(',')}}`,
    )

    await file.remove()
    return new File(file.path, Buffer.from(fileContent)).load()
  }
}
