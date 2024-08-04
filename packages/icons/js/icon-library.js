// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { IconLibraryTypes } from './types';
// WP Library
import { WPIcons } from './library-wp';
import { default as WPLibraryIcon } from './library-wp/library-icon';
import WPIconsSearchData from './library-wp/search-data.json';
// Blockera Library
import { BlockeraIcons } from './library-blockera';
import { default as LibraryIcon } from './library-blockera/library-icon';
import IconsSearchData from './library-blockera/search-data.json';
// UI Library
import { BlockeraUIIcons } from './library-ui';
import { default as LibraryUIIcon } from './library-ui/library-icon';
// Cursor Library
import { CursorIcons } from './library-cursor';
import { default as LibraryCursorIcon } from './library-cursor/library-icon';

export const IconLibraries: {
	[key: string]: {
		id: IconLibraryTypes,
		name: string,
		icon: MixedElement,
	},
} = {
	wp: {
		id: 'wp',
		// translators: Icon library name
		name: __('WordPress', 'blockera'),
		icon: <WPLibraryIcon />,
	},
	blockera: {
		id: 'blockera',
		// translators: Icon library name
		name: __('Blockera', 'blockera'),
		icon: <LibraryIcon />,
	},
	ui: {
		id: 'ui',
		// translators: Icon library name
		name: __('User Interface', 'blockera'),
		icon: <LibraryUIIcon />,
	},
	cursor: {
		id: 'cursor',
		// translators: Icon library name
		name: __('Cursors', 'blockera'),
		icon: <LibraryCursorIcon />,
	},
};

export function isValidIconLibrary(library: IconLibraryTypes): boolean {
	return !isUndefined(IconLibraries[library]);
}

export function getIconLibrary(library: IconLibraryTypes | 'all'): Object {
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

export function getIconLibraryIcons(iconLibrary: IconLibraryTypes): Object {
	if (!isValidIconLibrary(iconLibrary)) {
		return {};
	}

	switch (iconLibrary) {
		case 'ui':
			return BlockeraUIIcons;

		case 'blockera':
			return BlockeraIcons;

		case 'wp':
			return WPIcons;

		case 'cursor':
			return CursorIcons;
	}

	return {};
}

export function getIconLibrarySearchData(
	library: IconLibraryTypes | 'all'
): Array<any> {
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
