// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { WPIcons } from './library-wp';
import { BlockeraIcons } from './library-blockera';

import WPIconsSearchData from './library-wp/search-data.json';
import IconsSearchData from './library-blockera/search-data.json';
// import searchIndex from './search-index.json';

import { default as WPLibraryIcon } from './library-wp/library-icon';
import { default as LibraryIcon } from './library-blockera/library-icon';

const IconLibraries = {
	wp: {
		id: 'wp',
		// translators: Icon library name
		name: __('WordPress', 'blockera'),
		icon: <WPLibraryIcon />,
	},
	blockera: {
		id: 'blockera',
		// translators: Icon library name
		name: __('', 'blockera'),
		icon: <LibraryIcon />,
	},
};

export function isValidIconLibrary(library: string): boolean {
	return !isUndefined(IconLibraries[library]);
}

export function getIconLibrary(library: string): Object {
	const libs: { [key: string]: any } = {};

	if (library === 'all') {
		for (const key in IconLibraries) {
			libs[key] = IconLibraries[key];
		}
	} else if (isValidIconLibrary(library)) {
		libs[library] = IconLibraries[library];
	}

	return libs;
}

export function getIconLibraryIcons(iconLibrary: string): Object {
	if (!isValidIconLibrary(iconLibrary)) {
		return {};
	}

	switch (iconLibrary) {
		case 'blockera':
			return BlockeraIcons;

		case 'wp':
			return WPIcons;
	}

	return {};
}

export function getIconLibrarySearchData(library: string): Array<any> {
	const searchData: Array<any> = [];

	if (library === 'all' || isValidIconLibrary(library))
		switch (library) {
			case 'all':
				// $FlowFixMe
				Array.prototype.push.apply(searchData, WPIconsSearchData);
				// $FlowFixMe
				Array.prototype.push.apply(searchData, IconsSearchData);
				// $FlowFixMe
				break;

			case 'wp':
				// $FlowFixMe
				Array.prototype.push.apply(searchData, WPIconsSearchData);
				break;

			case 'blockera':
				// $FlowFixMe
				Array.prototype.push.apply(searchData, IconsSearchData);
				break;
		}

	return searchData;
}

// export function getIconLibrariesSearchIndex(): Object {
// 	return Fuse.parseIndex(searchIndex);
// }
