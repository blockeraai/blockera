// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';

export const getCore = (entity: string): ?Object => {
	const coreData = select('core');

	return !coreData[entity] ? null : coreData[entity]();
};

export { getCurrentTheme } from './current-theme';
