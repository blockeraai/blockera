// @flow

/**
 * Internal dependencies
 */
import * as _rawIcons from './icons/index';
import { getIconKebabId } from '../helpers';

const EssentialsIcons: Object = Object.fromEntries(
	Object.entries(_rawIcons).map(([key, value]) => [
		getIconKebabId(key),
		value,
	])
);

export { EssentialsIcons };
