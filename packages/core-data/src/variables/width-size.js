// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { isUndefined } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { getBlockEditorSettings } from './selectors';

export const getWidthSizes = (): Array<{
	slug: string,
	name: string,
	value: string,
}> => {
	// todo improve this to support all states and be more safe
	const layout = getBlockEditorSettings()?.__experimentalFeatures?.layout;

	if (isUndefined(layout)) {
		return [];
	}

	const items = [];

	if (!isUndefined(layout?.contentSize)) {
		items.push({
			name: __('Content Width', 'publisher-core'),
			slug: 'contentSize',
			value: layout?.contentSize,
		});
	}

	if (!isUndefined(layout?.wideSize)) {
		items.push({
			name: __('Site Width', 'publisher-core'),
			slug: 'wideSize',
			value: layout?.wideSize,
		});
	}

	return items;
};

export const getWidthSize = (
	slug: string
): ?{
	slug: string,
	name: string,
	value: string,
} => {
	return getWidthSizes().find((item) => item.name === slug);
};

export const getWidthSizeBy = (
	field: string,
	value: any
): ?{
	slug: string,
	name: string,
	value: string,
} => {
	return getWidthSizes().find((item) => item[field] === value);
};
