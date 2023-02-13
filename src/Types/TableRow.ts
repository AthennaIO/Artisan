/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export type TableRow =
  | (
      | string
      | {
          colSpan?: number
          hAlign?: 'left' | 'center' | 'right'
          content: string
        }
      | {
          rowSpan?: number
          vAlign?: 'top' | 'center' | 'bottom'
          content: string
        }
    )[]
  | { [key: string]: string[] }
