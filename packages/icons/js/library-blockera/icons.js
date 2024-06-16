// @flow

/**
 * Internal dependencies
 */
import * as _rawIcons from './icons/index';

const BlockeraIcons: Object = Object.fromEntries(
	Object.entries(_rawIcons).map(([key, value]) => [
		key
			.replace(/([a-z])([A-Z])/g, '$1-$2')
			.replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
			.toLowerCase(),
		value,
	])
);

export { BlockeraIcons };
