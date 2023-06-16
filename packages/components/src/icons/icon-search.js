/**
 * External dependencies
 */
import Fuse from 'fuse.js';

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

export function iconSearch({ query, library = 'all', limit }) {
	if (!query) {
		return {};
	}

	const fuse = new Fuse(
		getIconLibrarySearchData(library),
		{
			shouldSort: true,
			includeScore: false,
			keys: [
				{
					name: 'title',
					weight: 0.2,
				},
				{
					name: 'tags',
					weight: 0.5,
				},
			],
			minMatchCharLength: 3,
			useExtendedSearch: false,
			threshold: 0.15,
		},
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

	result.forEach((foundItem) => {
		if (foundItem?.item?.iconName)
			finalResult[foundItem.item.iconName] = foundItem.item;
	});

	return finalResult;
}

export function createIconsBaseSearchData({ library }) {
	if (!isValidIconLibrary(library)) {
		return [];
	}

	const libraryIcons = getIconLibraryIcons(library);
	let _charsToRemoveFromTagBegginig = 0;

	if (library === 'far' || library === 'fas') {
		_charsToRemoveFromTagBegginig = 3;
	} else if (library === 'publisher') {
		_charsToRemoveFromTagBegginig = 9;
	}

	const searchData = [];

	for (const icon in libraryIcons) {
		if (!isValidIcon(libraryIcons[icon])) {
			continue;
		}

		const title = icon
			.replace(/([A-Z])/g, ' $1')
			.slice(_charsToRemoveFromTagBegginig)
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
