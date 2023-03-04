/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CommandSettings } from '#src/Types/CommandSettings'

/**
 * Commands settings holds all the commands settings by the command key.
 *
 * @example
 * ```js
 * COMMANDS_SETTINGS.get('make:command')
 * // { loadApp: false, stayAlive: false, environments: ['console'] }
 * ```
 */
export const COMMANDS_SETTINGS = new Map<string, CommandSettings>()
