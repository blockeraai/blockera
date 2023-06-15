/**
 * External dependencies
 */
import Fuse from 'fuse.js';

/**
 * Internal dependencies
 */
import { getIconLibrarySearchData } from './icon-library';

export function iconSearch({ query, library = 'all', limit }) {
	if (!query) {
		return {};
	}

	const fuse = new Fuse(getIconLibrarySearchData(library), {
		shouldSort: true,
		includeScore: false,
		keys: ['name', 'tags'],
		minMatchCharLength: 3,
		useExtendedSearch: true,
		threshold: 0.4,
	});

	let result = fuse.search(query);

	if (!result?.length) {
		return [];
	}

	if (limit) {
		result = result.slice(0, limit);
	}

	const finalResult = {};

	result.forEach((foundItem) => {
		if (foundItem?.item?.iconName)
			finalResult[foundItem.item.iconName] = foundItem.item;
	});

	return finalResult;
}
