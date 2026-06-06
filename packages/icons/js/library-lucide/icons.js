//@flow

/**
 * External dependencies
 */
import * as lucideStatic from 'lucide-static';

/**
 * Internal dependencies
 */
import { getIconKebabId } from '../helpers';

const LucideIcons: Object = Object.fromEntries(
	Object.entries(lucideStatic)
		.filter(([, value]) => typeof value === 'string')
		.map(([key, value]) => [getIconKebabId(key), value])
);

export { LucideIcons };
