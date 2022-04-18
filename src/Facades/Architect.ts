/**
 * @athenna/architect
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Facade } from '@athenna/ioc'
import { Architect as IArchitect } from '../Architect'

export const Architect = Facade.createFor<IArchitect>('Athenna/Core/Architect')
