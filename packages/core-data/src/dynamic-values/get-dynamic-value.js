// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';

/**
 * Internal dependencies
 */
import type { DynamicValueItem } from './types';
import {
	getPostDynamicValueItem,
	getFeaturedImageDynamicValueItem,
	getArchiveDynamicValueItem,
	getOtherDynamicValueItem,
	getSiteDynamicValueItem,
	getUserDynamicValueItem,
} from './index';

export const getDynamicValue: (
	category: string,
	id: string
) => ?DynamicValueItem = memoize(function (
	category: string,
	id: string
): ?DynamicValueItem {
	switch (category) {
		case 'post':
			return getPostDynamicValueItem(id);
		case 'featured-image':
			return getFeaturedImageDynamicValueItem(id);
		case 'archive':
			return getArchiveDynamicValueItem(id);
		case 'other':
			return getOtherDynamicValueItem(id);
		case 'site':
			return getSiteDynamicValueItem(id);
		case 'user':
			return getUserDynamicValueItem(id);
	}

	return null;
});
