/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { TaskManager } from '#src/Helpers/Task'

export declare type TaskCallback = (task: TaskManager) => void | Promise<void>
