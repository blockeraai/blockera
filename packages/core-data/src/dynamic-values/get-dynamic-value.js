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
} from './index';

const _getDynamicValue = function (
	category: string,
	id: string
): ?DynamicValueItem {
	switch (category) {
		case 'post':
			return getPostDynamicValueItem(id);
		case 'featured-image':
			return getFeaturedImageDynamicValueItem(id);
	}

	return null;
};

const _getDynamicValueMemoized = memoize(_getDynamicValue);

export const getDynamicValue = (
	category: string,
	id: string
): ?DynamicValueItem => {
	return _getDynamicValueMemoized(category, id);
};
