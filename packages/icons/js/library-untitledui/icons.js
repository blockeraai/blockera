//@flow

/**
 * External dependencies
 */
import * as _rawIcons from '@untitledui/icons';

/**
 * Internal dependencies
 */
import { getIconKebabId } from '../helpers';

const UntitleduiIcons: Object = Object.fromEntries(
	Object.entries(_rawIcons)
		.map(([key, value]) => [getIconKebabId(key), value])
		.filter(([, value]) => typeof value === 'function')
);

export { UntitleduiIcons };
