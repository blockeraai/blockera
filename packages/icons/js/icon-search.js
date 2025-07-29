// @flow

/**
 * External dependencies
 */
import Fuse from 'fuse.js';
import memoize from 'fast-memoize';

/**
 * Internal dependencies
 */
import {
	getIconLibraryIcons,
	getIconLibrarySearchData,
	getIconLibrariesSearchIndex,
	isValidIconLibrary,
} from './icon-library';
import { isValidIcon } from './icon';
import { type IconLibraryTypes } from './types';

export function iconSearch({
	query,
	library = 'all',
	limit,
}: {
	query: string,
	limit: number,
	library: IconLibraryTypes,
}): Object {
	if (!query) {
		return {};
	}

	const getMemoizedResult = memoize(() => {
		// We define which keys in our objects should be searched and how much weight they should have.
		// A higher weight means matches in that key are more relevant.
		const options = {
			// `includeScore` is useful for debugging or advanced sorting.
			includeScore: true,
			// `threshold` determines how "fuzzy" the search is. 0.0 is a perfect match, 1.0 matches anything.
			threshold: 0.4,
			// `keys` specifies the properties to search in.
			keys: [
				{
					name: 'title', // Search the 'title' property
					weight: 2, // Give it a high weight, as titles are very important.
				},
				{
					name: 'tags', // Search the 'tags' array
					weight: 1.5, // Tags are also very important.
				},
				{
					name: 'iconName', // Search the 'iconName'
					weight: 1, // Less important than title/tags, but still relevant.
				},
			],
		};

		const fuse = new Fuse(
			getIconLibrarySearchData(library),
			options,
			getIconLibrariesSearchIndex()
		);

		let result = fuse.search(query);

		if (!result?.length) {
			return [];
		}

		if (limit) {
			result = result.slice(0, limit);
		}

		const finalResult = {};

		const memoizedRegistration = memoize((foundItem) => {
			if (foundItem?.item?.iconName)
				finalResult[foundItem.item.iconName] = foundItem.item;
		});

		result.forEach(memoizedRegistration);

		return finalResult;
	});

	return getMemoizedResult();
}

export function createIconsBaseSearchData({
	library,
}: {
	library: IconLibraryTypes,
}): Array<any> {
	if (!isValidIconLibrary(library)) {
		return [];
	}

	const libraryIcons = getIconLibraryIcons(library);
	let _charsToRemoveFromTagBeginning = 0;

	if (library === 'blockera') {
		_charsToRemoveFromTagBeginning = 9;
	}

	const searchData = [];

	for (const icon in libraryIcons) {
		if (!isValidIcon(libraryIcons[icon])) {
			continue;
		}

		const title = icon
			.replace(/([A-Z])/g, ' $1')
			.slice(_charsToRemoveFromTagBeginning)
			.replace(/( Alt)(?!.*\1)/, '')
			.trim();

		searchData.push({
			iconName: icon,
			title: title ? title : icon,
			library,
			tags: [],
		});
	}

	// sort
	searchData.sort((a, b) => {
		let number: number;

		if (a.iconName > b.iconName) {
			number = 1;
		} else {
			number = b.iconName > a.iconName ? -1 : 0;
		}

		return number;
	});

	return searchData;
}
